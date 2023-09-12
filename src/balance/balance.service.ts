import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Status as transactionStatus, Transaction} from '../database/entities/Transaction.entity';
import {Currency} from '../database/entities/Currency.entity';
import {Status as withdrawStatus, Withdraw} from '../database/entities/withdraw.entity';
import {ethers} from "ethers";

@Injectable()
export class BalanceService {
    constructor(
        @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,
        @InjectRepository(Currency) private currencyRepo: Repository<Currency>,
        @InjectRepository(Withdraw) private withdrawRepo: Repository<Withdraw>,

    ) {}
    public async getAllBalances(userId: number) {
        const currencies = await this.currencyRepo.find({
            relations: ['tokens'],
        });
        let balances = [currencies.length];
        for (let i = 0; i < currencies.length; i++) {

        }
    }
    public async getBalanceByTokenId(userId: number, currencyId: number): Promise<string> {
        const transactionSum = await this.transactionSum(userId, currencyId);
        const withdrawSum = await this.withdrawSum(userId, currencyId);
        const balance = transactionSum - withdrawSum;
        return this.convertWei(currencyId, balance);
    }
    private async transactionSum(userId: number, currencyId: number): Promise<bigint> {
        const transactionAmounts = await this.transactionRepo.find({
            where: {
                user: { id: userId },
                currency: { id: currencyId },
                status: transactionStatus.SUCCESSFUL,
            },
            select: ['amount'],
        });
        let transactionSum = BigInt(0);
        for (let i = 0; i < transactionAmounts.length; i++) {
            transactionSum += BigInt(transactionAmounts[i].amount);
        }
        return transactionSum;
    }
    private async withdrawSum(userId: number, currencyId: number): Promise<bigint> {
        const withdrawAmounts = await this.withdrawRepo.find({
            where: {
                user: { id: userId },
                currency: { id: currencyId },
                status: withdrawStatus.SUCCESSFUL,
            },
            select: ['amount'],
        });
        let withdrawSum = BigInt(0);
        for (let i = 0; i < withdrawAmounts.length; i++) {
            withdrawSum += BigInt(withdrawAmounts[i].amount);
        }
        return withdrawSum;
    }
    private async convertWei(currencyId: number, balance: bigint): Promise<string> {
        const currency = await this.currencyRepo.findOneById(currencyId);
        return ethers.formatUnits(balance, currency.decimals);
    }
}
