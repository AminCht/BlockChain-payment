import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status, Transaction } from '../database/entities/Transaction.entity';
import { Repository } from 'typeorm';
import { TransactionNotFoundException } from './exceptions/transactionNotFound';

@Injectable()
export class TransactionService {
    constructor(@InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,){}

    async getTransactionById(req, transactionId: number){
        console.log(req.user.id);
        
        while(true){
            const transaction = await this.transactionRepo.findOne({
                where:{
                    id:transactionId
                },relations:["user"]
            });
            if(!transaction){
                throw new TransactionNotFoundException(transactionId);
            }
            if(req.user.id != transaction.user.id){
                throw new TransactionNotFoundException(transactionId);
            }
            if(transaction.status == Status.FAILED || transaction.status == Status.SUCCESSFUL){
                return transaction;
            }
            await this.sleep(4);
        }
    }
    async sleep(duration: number): Promise<void>{
        return new Promise<void>((resolve) => {
            setTimeout(() => {
              console.log('Delayed logic executed');
              resolve();
            }, duration*1000);
          });
    }
}
