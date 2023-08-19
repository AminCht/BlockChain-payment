import { Command, CommandRunner } from 'nest-commander';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet, Wallet as WalletEntity } from "../database/entities/Wallet.entity";
import { Transaction } from '../database/entities/Transaction.entity';
import { Contract, InfuraProvider } from 'ethers';
import { ethers } from 'ethers';
import { DataSource, Repository } from "typeorm";
import { ethereumTokenAddresses } from '../payment/tokenAddresses/EthereumTokenAddresses';

@Command({ name: 'check-balance' })
export class CheckBallanceCommand extends CommandRunner {

    private readonly provider: InfuraProvider;
    private tokenContract: Contract;
    private readonly tokenABI = ['function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)',]
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
        @InjectRepository(Wallet)
        private readonly walletRepo: Repository<Wallet>,

        private dataSource: DataSource,
    ) {
        super();
        this.provider = new InfuraProvider(process.env.NETWORK, process.env.API_KEY);
    }
    public async run(): Promise<void> {
        const transactions = await this.transactionRepo.find({ where: { status: "Pending"},relations:["wallet"] });
        for (const transaction of transactions) {
            try {
                await this.updateTransactionStatus(transaction);
            } catch (error) {
                console.log(error);
            }
        }
    }

    async updateTransactionStatus(transaction: Transaction) {
        const now = new Date();
        let currentBalance;
        let decimals;
        if (
            transaction.currency.symbol == 'eth' &&
            transaction.currency.network == 'ethereum'
        ) {
            currentBalance = await this.getBalance(transaction.wallet.address);
        } else if (
            transaction.currency.symbol != 'eth' &&
            transaction.currency.network == 'ethereum'
        ) {
            currentBalance = await this.getTokenBalance(
                transaction.wallet.address,
                transaction.currency.symbol,
            );
            decimals = await this.tokenContract.decimals();
        } else { return; }
        const expectedAmount = ethers.parseUnits(transaction.amount, decimals);
        const receivedAmount = BigInt(currentBalance) - BigInt(transaction.wallet_balance_before);
        if (now >= transaction.expireTime) {
           await this.changeTransactionStatus(transaction, 'Failed', currentBalance);
        } else if (receivedAmount >= expectedAmount) {
            await this.changeTransactionStatus(transaction, 'Successfully', currentBalance);}
        else {await this.changeTransactionStatus(transaction, 'Pending', currentBalance);}
    }

    async changeTransactionStatus(transaction: Transaction, status: 'Successfully'|'Failed'|'Pending', afterBalance: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        const wallet = transaction.wallet;
        if(status!='Pending'){
            wallet.lock = false;
        }
        transaction.status = status;
        transaction.wallet_balance_after = afterBalance;
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            await queryRunner.manager.save(transaction);
            if(status!='Pending'){
                await queryRunner.manager.update(
                Wallet,
                { id: transaction.wallet.id },
                { lock: false },
                );
            }
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return error;
        } finally {
            await queryRunner.release();
        }
    }
    async getBalance(address: string): Promise<string> {
        const balancePromise = await this.provider.getBalance(address);
        return balancePromise.toString();
    }
    async getTokenBalance(address: string, currency: string): Promise<string> {
        await this.createTokenContract(currency);
        const balance = await this.tokenContract.balanceOf(address);
        return balance.toString();
    }
    async createTokenContract(currency: string) {
        this.tokenContract = new ethers.Contract(
            ethereumTokenAddresses.get(currency),
            this.tokenABI,
            this.provider,
        );
    }
}
