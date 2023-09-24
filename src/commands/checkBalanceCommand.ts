import {Command, CommandRunner} from 'nest-commander';
import {InjectRepository} from '@nestjs/typeorm';
import {Wallet} from "../database/entities/Wallet.entity";
import {Status, Transaction} from '../database/entities/Transaction.entity';
import {Contract, ethers,Provider} from 'ethers';
import {DataSource, Repository} from "typeorm";
import {Providers} from "../providers";
import { TronWeb } from 'tronweb';

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
            transaction.currency.symbol == 'trx' &&
            transaction.currency.network == 'nile'
        ) {
            const provider = this.selectTvmProvider(transaction.currency.network);
            currentBalance = await this.getTrxBalance(transaction.wallet.address, provider);
        } else if (
            transaction.currency.symbol != 'trx' &&
            transaction.currency.network == 'nile'
        ) {
            const provider = this.selectTvmProvider(transaction.currency.network);
            currentBalance = await this.getTrxTokenBalance(transaction.wallet.address,transaction.currency.address, provider);
        } else { return; }
        const expectedAmount = BigInt(transaction.amount);
        const receivedAmount = BigInt(currentBalance) - BigInt(transaction.wallet_balance_before);
        if (now >= transaction.expireTime) {
           await this.changeTransactionStatus(transaction,Status.FAILED , currentBalance);
        } else if (receivedAmount >= expectedAmount) {
            await this.changeTransactionStatus(transaction, Status.SUCCESSFUL, currentBalance);}
        else {await this.changeTransactionStatus(transaction, Status.PENDING, currentBalance);}
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
        }
    }
    async getEthBalance(address: string, provider): Promise<string> {
        const balancePromise = await provider.getBalance(address);
        return balancePromise.toString();
    }
    async getEthTokenBalance(address: string, currencyAddress: string, provider): Promise<string> {
        await this.createTokenContract(currencyAddress, provider);
        const balance = await this.tokenContract.balanceOf(address, provider);
        console.log({address})
        console.log({currencyAddress})
        return balance.toString();
    }
    async createTokenContract(currencyAddress: string,provider) {
        this.tokenContract = new ethers.Contract(
            currencyAddress,
            this.ethereumTokenABI,
            provider,
        );
    }
    private async getTrxTokenBalance(address, currencyAddress, provider: TronWeb) {
        try {
            provider.setAddress(currencyAddress);
            const contract = await provider.contract(this.tronTokenABI).at(currencyAddress);
            const balance = await contract.balanceOf(address).call();
            return balance.toString();
        } catch (error) {
            throw new Error(`Error fetching token balance: ${error.message}`);
        }
    }
    private async getTrxBalance(address, provider: TronWeb) {
        try {
            const balance = await provider.trx.getBalance(address);
            return balance.toString();
        } catch (error) {
            throw new Error(`Error fetching balance: ${error.message}`);
        }
    }
    private selectEvmProvider(network: string): Provider {
        return Providers.selectEvmProvider(network);

    }
    public selectTvmProvider(network: string): TronWeb {
        return Providers.selectTvmProvider(network);
    }
}
