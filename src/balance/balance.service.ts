import { Injectable } from '@nestjs/common';
import { User } from '../database/entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../database/entities/Transaction.entity';

@Injectable()
export class BalanceService {
    constructor(
        @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,
    ) {}
    public async getAllBalances(userId: number, currencySymbol: string, currencyNetwork: string) {
        const transactions = await this.transactionRepo.find({
            where: {
                user: { id: userId },
                status: 'Successful',
                currency: { symbol: currencySymbol, network: currencyNetwork },
            },
        });
        let amountSum = 0;
        for (let i = 0; i < transactions.length; i++) {
            amountSum += Number(transactions[i].amount);
        }
        console.log(transactions);
        console.log(amountSum);
    }
    public async getBalanceByTokenId(userId: number, currencyId:number, currencySymbol: string, currencyNetwork: string) {

    }
}
