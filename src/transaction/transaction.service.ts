import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../database/entities/Transaction.entity';
import { Repository } from 'typeorm';
import { TransactionNotFoundException } from './exceptions/transactionNotFound';

@Injectable()
export class TransactionService {
    constructor(@InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,){}

    async getTransactionById(transactionId: number){

        const transaction = await this.transactionRepo.findOne({
            where:{
                id:transactionId
            }
        });
        if(!transaction){
            throw new TransactionNotFoundException(transactionId);
        }
        return transaction;
    }
}
