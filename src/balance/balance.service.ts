import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../database/entities/Transaction.entity';
import { Currency } from '../database/entities/Currency.entity';
import { Withdraw } from '../database/entities/withdraw.entity';

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
    public async getBalanceByTokenId(userId: number, currencyId: number) {
        const sum = await this.transactionRepo
            .createQueryBuilder('transaction')
            .select('SUM(CAST(transaction.amount AS DECIMAL))', 'totalAmount')
            .where('transaction.user.id = :userId', { userId })
            .andWhere('transaction.status = :status', { status: 'Successful' })
            .andWhere('transaction.currency.id = :currencyId', { currencyId })
            .getRawOne();
        const withdrawSum = await this.withdrawRepo
            .createQueryBuilder('withdraw')
            .select('SUM(CAST(withdraw.amount AS DECIMAL))', 'totalAmount')
            .where('withdraw.user.id = :userId', { userId })
            .andWhere('withdraw.status = :status', { status: 0 })
            .andWhere('withdraw.currency.id = :currencyId', { currencyId })
            .getRawOne();
        return { balance: sum - withdrawSum };
    }
}
