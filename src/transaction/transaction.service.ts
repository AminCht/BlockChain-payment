import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status, Transaction } from '../database/entities/Transaction.entity';
import { Repository } from 'typeorm';
import { TransactionNotFoundException } from './exceptions/transactionNotFound';

@Injectable()
export class TransactionService {
    constructor(@InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,){}

    async getTransactionById(transactionId: number){
        while(true){
            const transaction = await this.transactionRepo.findOne({
                where:{
                    id:transactionId
                }
            });
            if(!transaction){
                throw new TransactionNotFoundException(transactionId);
            }
            if(transaction.status == Status.PENDING || transaction.status == Status.SUCCESSFUL){
                return transaction;
            }
        }
    }
}
