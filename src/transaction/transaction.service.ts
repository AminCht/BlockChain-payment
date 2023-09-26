import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status, Transaction } from '../database/entities/Transaction.entity';
import { Repository } from 'typeorm';
import { TransactionNotFoundException } from './exceptions/transactionNotFound';
import { User } from '../database/entities/User.entity';
enum Statuss {
    Pending = 'Pending',
    Successful = 'Successful',
    Failed = 'Failed',
  }
@Injectable()
export class TransactionService {
    constructor(@InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,){}
    public async getTransactionById(user: User, transactionId: number): Promise<Object> {
        while (true) {
            const transaction = await this.transactionRepo
            .createQueryBuilder('transaction').leftJoinAndSelect('transaction.currency', 'currency')
            .where('transaction.userId=:userId',{userId: user.id}).andWhere('transaction.id=:id', {id: transactionId})
            .select(['transaction', 'currency.decimals'])
            .getOne();
            if(!transaction){
                throw new TransactionNotFoundException(transactionId);
            }
            if(transaction.status == Status.FAILED || transaction.status == Status.SUCCESSFUL){
                delete transaction.user;
                delete transaction.wallet_balance_after;
                delete transaction.wallet_balance_before;
                const transactionStatus = await this.convertStatusNumber(transaction.status);
                transaction.amount = String(this.convertAmount(transaction.amount, transaction.currency.decimals));
                const retunedObject = this.convertTransactionToCustomObject(transaction, transactionStatus);
                return retunedObject;
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
    public convertAmount(amount: string, decimal: number){
        const convertedAmount =BigInt(amount) / BigInt(10) ** BigInt(decimal);
        return Number(convertedAmount);
    }
    public async convertStatusNumber(status: number){
        if(status == 0){
            return 'Pending'
        }
        else if(status == 1){
            return 'Sucssesful'
        }
        return 'Failed'
    }
    public async convertTransactionToCustomObject(transaction: Transaction, status: string){
        const convertedObject = {id: transaction.id, amount: transaction.amount, status: status, created_date: transaction.created_date, expireTime: transaction.expireTime}
        return convertedObject;
    }
}
