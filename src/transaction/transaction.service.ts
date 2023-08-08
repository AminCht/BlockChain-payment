import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../database/entities/Transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
    constructor(@InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,){}

    async getTransactionById(transactionId: number){
        
        const transaction = await this.transactionRepo.findOne({
            where:{
                id:transactionId
            }
        });
        return transaction;
    }
}
