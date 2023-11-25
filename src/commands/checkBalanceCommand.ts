import {Command, CommandRunner} from 'nest-commander';
import {InjectRepository} from '@nestjs/typeorm';
import {Wallet} from "../database/entities/Wallet.entity";
import {Status, Transaction} from '../database/entities/Transaction.entity';
import {Contract, ethers,Provider} from 'ethers';
import {DataSource, Repository} from "typeorm";
import {Providers} from "../providers";
import { TronWeb } from 'tronweb';
import { HttpService } from '@nestjs/axios';
import { TransactionService } from '../transaction/transaction.service';
import { PaymentService } from '../payment/payment.service';

@Command({ name: 'check-balance' })
export class CheckBalanceCommand extends CommandRunner {
    private tokenContract: Contract;
    private readonly ethereumTokenABI = ['function balanceOf(address owner) view returns (uint256)']
    private readonly tronTokenABI = [
        {
            constant: true,
            inputs: [
                {
                    name: '_owner',
                    type: 'address',
                },
            ],
            name: 'balanceOf',
            outputs: [
                {
                    name: 'balance',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
    ];
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
        private dataSource: DataSource,
        private httpService: HttpService,
        private paymentService: PaymentService
    ) {
        super();
    }
    public async run(): Promise<void> {
        const transactions = await this.transactionRepo.find({ where: { status: Status.PENDING},relations:["wallet","currency"] });
        for (const transaction of transactions) {
            await this.updateTransactionStatus(transaction);
        }
    }

    async updateTransactionStatus(transaction: Transaction) {
        const now = new Date();
        let currentBalance;
        if (
            transaction.currency.symbol == 'eth' &&(
            transaction.currency.network == 'ethereum'||
            transaction.currency.network == 'sepolia' ||
            transaction.currency.network == 'bsc')
        ) {
            const provider = this.selectEvmProvider(transaction.currency.network);
            currentBalance = await this.getEthBalance(transaction.wallet.address, provider);
        } else if (
            transaction.currency.symbol != 'eth' &&(
            transaction.currency.network == 'ethereum'||
            transaction.currency.network == 'sepolia' ||
            transaction.currency.network == 'bsc')
        ) {
            const provider = this.selectEvmProvider(transaction.currency.network);
            currentBalance = await this.getEthTokenBalance(
                transaction.wallet.address,
                transaction.currency.address,
                provider,
            );
        } else if (
            transaction.currency.symbol == 'trx' &&(
            transaction.currency.network == 'nile' ||
            transaction.currency.network == 'tron')
        ) {
            const provider = this.selectTvmProvider(transaction.currency.network);
            currentBalance = await this.paymentService.getTrxBalance(transaction.wallet.address, provider);
        } else if (
            transaction.currency.symbol != 'trx' &&(
            transaction.currency.network == 'nile' ||
            transaction.currency.network == 'tron')
        ) {
            const provider = this.selectTvmProvider(transaction.currency.network);
            currentBalance = await this.paymentService.getTrxTokenBalance(transaction.wallet.address,transaction.currency.address, provider);
        } else if(
            transaction.currency.symbol == 'btc' &&
            transaction.currency.network =='bitcoin'||
            transaction.currency.network == 'bitcoin test') {
                currentBalance = await this.paymentService.getBitcoinBalance(transaction.wallet);
         }
        const expectedAmount = BigInt(transaction.amount);
        const receivedAmount = BigInt(currentBalance) - BigInt(transaction.wallet_balance_before);
        if (now >= transaction.expireTime) {
           await this.changeTransactionStatus(transaction,Status.FAILED , currentBalance);
        } else if (receivedAmount >= expectedAmount) {
            await this.changeTransactionStatus(transaction, Status.SUCCESSFUL, currentBalance);
        }
        else {
            await this.changeTransactionStatus(transaction, Status.PENDING, currentBalance);
        }
    }

    async changeTransactionStatus(transaction: Transaction, status: Status, afterBalance: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        const wallet = transaction.wallet;
        if(status != Status.PENDING){
            wallet.lock = false;
        }
        transaction.status = status;
        transaction.wallet_balance_after = afterBalance;
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            await queryRunner.manager.save(transaction);
            if (status != Status.PENDING) {
                await queryRunner.manager.update(
                    Wallet,
                    { id: transaction.wallet.id },
                    { lock: false },
                );
            }
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
            if(status != Status.PENDING){
                await this.sendPostRequestToUrl(transaction.callbackUrl, transaction);
            }
        }
    }
    async getEthBalance(address: string, provider): Promise<string> {
        const balancePromise = await provider.getBalance(address);
        return balancePromise.toString();
    }
    async getEthTokenBalance(address: string, currencyAddress: string, provider): Promise<string> {
        await this.createTokenContract(currencyAddress, provider);
        const balance = await this.tokenContract.balanceOf(address, provider);
        return balance.toString();
    }
    async createTokenContract(currencyAddress: string,provider) {
        this.tokenContract = new ethers.Contract(
            currencyAddress,
            this.ethereumTokenABI,
            provider,
        );
    }
    private selectEvmProvider(network: string): Provider {
        return Providers.selectEvmProvider(network);

    }
    public selectTvmProvider(network: string): TronWeb {
        return Providers.selectTvmProvider(network);
    }

    async sendPostRequestToUrl(callbackUrl: string, transaction: Transaction){
        const body = { trasnactionId: transaction.id, amount: transaction.amount, created_Date: transaction.created_date, status: transaction.status};
        await this.httpService.post(callbackUrl, body);
    }

}
