import {Command, CommandRunner} from 'nest-commander';
import {InjectRepository} from '@nestjs/typeorm';
import {Wallet} from "../database/entities/Wallet.entity";
import {Status, Transaction} from '../database/entities/Transaction.entity';
import {Contract, ethers, InfuraProvider, Provider} from 'ethers';
import {DataSource, Repository} from "typeorm";
import {Providers} from "../providers";

@Command({ name: 'check-balance' })
export class CheckBalanceCommand extends CommandRunner {

    private ethProvider: InfuraProvider;
    private bscProvider: Provider;
    private sepoliaPrivider: InfuraProvider;
    private tokenContract: Contract;
    private readonly tokenABI = ['function balanceOf(address owner) view returns (uint256)']
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
        const provider = this.selectEvmProvider(transaction.currency.network);
        if (
            transaction.currency.symbol == 'eth' &&
            transaction.currency.network == 'ethereum'
        ) {
            currentBalance = await this.getBalance(transaction.wallet.address, provider);
        } else if (
            transaction.currency.symbol != 'eth' &&
            transaction.currency.network == 'ethereum'
        ) {
            currentBalance = await this.getTokenBalance(
                transaction.wallet.address,
                transaction.currency.address,
                provider,
            );
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
    async getBalance(address: string, provider): Promise<string> {
        const balancePromise = await provider.getBalance(address);
        return balancePromise.toString();
    }
    async getTokenBalance(address: string, currencyAddress: string, provider): Promise<string> {
        await this.createTokenContract(currencyAddress, provider);
        const balance = await this.tokenContract.balanceOf(address, provider);
        return balance.toString();
    }
    async createTokenContract(currencyAddress: string,provider) {
        this.tokenContract = new ethers.Contract(
            currencyAddress,
            this.tokenABI,
            provider,
        );
    }
    private selectEvmProvider(network: string): Provider {
        return Providers.selectEvmProvider(network);

    }
}
