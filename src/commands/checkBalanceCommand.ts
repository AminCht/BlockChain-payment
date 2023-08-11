import { Command, CommandRunner } from 'nest-commander';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet as WalletEntity } from '../database/entities/Wallet.entity';
import { Transaction } from '../database/entities/Transaction.entity';
import { InfuraProvider } from "ethers";
import { ethers } from 'ethers';
import { DataSource, Repository } from "typeorm";

@Command({ name: 'check-balance' })
export class CheckBallanceCommand extends CommandRunner {

    public provider: InfuraProvider;

    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
        @InjectRepository(WalletEntity)
        private dataSource: DataSource,
    ) {
        super();
        this.provider = new InfuraProvider(process.env.NETWORK, process.env.API_KEY);
    }

    async run(): Promise<void> {
        const transactions = await this.transactionRepo.find({ where: { status: "Pending"} });
        for (const transation of transactions) {
            await this.updateTransactionStatus(transation);
        }
    }

    async updateTransactionStatus(transaction: Transaction) {
        const now = new Date();
        const currentBalance = await this.getCurrentBalance(transaction.wallet.address);
        const receivedAmount = BigInt(currentBalance) - BigInt(transaction.wallet_balance_before);
        const expectedAmount = ethers.parseEther(transaction.amount);
        if (receivedAmount >= expectedAmount) {
            await this.changeTransactionStatus(transaction, 'Successfully', currentBalance);
        } else if (now >= transaction.expireTime) {
            await this.changeTransactionStatus(transaction, 'failed', currentBalance);
        }
    }

    async changeTransactionStatus(transaction: Transaction, status: 'Successfully'|'failed', afterBalance: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        const wallet = transaction.wallet;
        wallet.lock = false;
        transaction.status = status;
        transaction.wallet_balance_after = afterBalance;
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            await queryRunner.manager.save(transaction);
            await queryRunner.manager.save(wallet);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return error;
        } finally {
            await queryRunner.release();
        }
    }

    async getCurrentBalance(address: string): Promise<string> {
        const balancePromise = await this.provider.getBalance(address);
        return balancePromise.toString();
    }
}
