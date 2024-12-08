import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status, Transaction } from '../database/entities/Transaction.entity';
import { Repository } from 'typeorm';
import { TransactionNotFoundException } from './exceptions/transactionNotFound';
import { User } from '../database/entities/User.entity';
import { GetTransactionByIdResponseDto } from './dto/transaction.dto';
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
                const transactionResponseDto= GetTransactionByIdResponseDto.entityToDto(transaction);
                return transactionResponseDto;
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
