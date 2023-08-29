import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Withdraw } from '../database/entities/withdraw.entity';
import { Repository } from 'typeorm';
import { CreateWithdrawDto } from './dto/withdraw.dto';
import { User } from '../database/entities/User.entity';
import { Status, Transaction } from '../database/entities/Transaction.entity';
import { Status as withdrawStatus} from '../database/entities/withdraw.entity';

@Injectable()
export class WithdrawService {
    constructor (
        @InjectRepository(Withdraw) private withdrawRepo: Repository<Withdraw>,
        @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,){}

    async getAllWithdraws(userId: number){
        return await this.withdrawRepo.find({
            where: {
                user:{
                    id: userId
                }
            }
        });
    }

    async createWithdraw(dto: CreateWithdrawDto, user: User){
        const withdraw = this.getUserWithdraw(user.id); 
        if(withdraw){
            throw new BadRequestException('You have a pending Withdraw Request');
        }
        const allowedAmount = await this.getAllowedAmount({ token: dto.token, network: dto.network }, user);
        if(Number(dto.amount) < Number(allowedAmount)){
            const withdraw = this.withdrawRepo.create({
                user: user,
                amount: dto.amount,
                dst_wallet: dto.dst_wallet
            });
            return await this.withdrawRepo.save(withdraw);
        }
        throw new BadRequestException('Your requested amount is less than your payments');

    }
    async getUserWithdraw(userId: number){
        const withDraw = await this.withdrawRepo.findOne({
            where:{
                status: withdrawStatus.PENDING,
                user:{
                    id: userId
                }
            }
        });
        return withDraw;
    }
    async getAllowedAmount(currency: {token: string, network: string}, user: User): Promise <Number>{
        const transactionsAmount = await this.getAllSuccessfulTransactions(currency, user)
        const acceptedWithdrawAmount = await this.getAllAcceptedWithDraw(user);
               
        return transactionsAmount - acceptedWithdrawAmount;
    }

    async getAllSuccessfulTransactions(currency: {token: string, network: string}, user: User){
        const transaction = await this.transactionRepo.createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.currency', 'currency')
        .select('SUM(CAST(transaction.amount AS DECIMAL))', 'sum')
        .where('transaction.userId=:userId',{userId: user.id}).andWhere('currency.symbol:token', {token: currency.token})
        .andWhere('currency.network:network', {network: currency.network})
        .andWhere('transaction.status=:status', {status: Status.SUCCESSFUL}).getRawOne();
        return transaction.sum;
    }

    async getAllAcceptedWithDraw(user: User){
        const acceptedwithdraw = await this.transactionRepo.createQueryBuilder('withdraw')
        .leftJoinAndSelect('withdraw.user', 'user')
        .select('SUM(CAST(transaction.amount AS DECIMAL))', 'sum')
        .where('withdraw.userId=:userId',{userId: user.id}).andWhere('withdraw.status:status', {status: withdrawStatus.SUCCESSFUL})
        .getRawOne();
        return acceptedwithdraw.sum; 
    }
}