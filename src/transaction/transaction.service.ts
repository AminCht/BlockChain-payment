import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status, Transaction } from '../database/entities/Transaction.entity';
import { Repository } from 'typeorm';
import { TransactionNotFoundException } from './exceptions/transactionNotFound';
import { User } from '../database/entities/User.entity';

@Injectable()
export class TransactionService {
    constructor(@InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,){}

    public async getTransactionById(user: User, transactionId: number): Promise<Transaction> {
        while (true) {
            const transaction = await this.transactionRepo
            .createQueryBuilder('transaction')
            .where('transaction.userId=:userId',{userId: user.id}).andWhere('transaction.id=:id', {id: transactionId})
            .select(['transaction'])
            .getOne();
            if(!transaction){
                throw new TransactionNotFoundException(transactionId);
            }
            if(transaction.status == Status.FAILED || transaction.status == Status.SUCCESSFUL){
                delete transaction.user;
                return transaction;
            }
            await this.sleep(4);
        }
    }
    private async sleep(duration: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
              console.log('Delayed logic executed');
              resolve();
            }, duration*1000);
        });
    }
}
