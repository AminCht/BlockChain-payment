import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Withdraw } from '../database/entities/withdraw.entity';
import { Repository } from 'typeorm';
import { CreateWithdrawDto, UpdateWithdrawRequestDto } from './dto/withdraw.dto';
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
        const withdraw = await this.getUserWithdraw(user.id); 
        if(withdraw){
            throw new BadRequestException('You have a pending Withdraw Request');
        }
        const allowedAmount = await this.getAllowedAmount({ token: dto.token, network: dto.network }, user);
        if(Number(dto.amount) <= Number(allowedAmount)){
            const withdraw = this.withdrawRepo.create({
                amount: dto.amount,
                token: dto.token,
                network: dto.network,
                dst_wallet: dto.dst_wallet,
                user: user
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
        .where('transaction.userId=:userId',{userId: user.id}).andWhere('currency.symbol=:token', {token: currency.token})
        .andWhere('currency.network=:network', {network: currency.network})
        .andWhere('transaction.status=:status', {status: Status.SUCCESSFUL}).getRawOne();
        return transaction.sum;
    }
    
    async getAllAcceptedWithDraw(user: User){
        const acceptedwithdraw = await this.withdrawRepo.createQueryBuilder('withdraw')
        .leftJoinAndSelect('withdraw.user', 'user')
        .select('SUM(CAST(withdraw.amount AS DECIMAL))', 'sum')
        .where('withdraw.userId=:userId',{userId: user.id}).andWhere('withdraw.status=:status', {status: withdrawStatus.SUCCESSFUL})
        .getRawOne();
        return acceptedwithdraw.sum; 
    }

    async cancelWithdraw(id: number){
        await this.checkWithdrawById(id);
        return await this.withdrawRepo.update(id,{
            status: withdrawStatus.CANCEL
        });
    }

    async updateWithdraw(dto: UpdateWithdrawRequestDto, id: number,user: User){
        const withdraw = await this.checkWithdrawById(id);
        let allowedAmount;
        if(dto.network && dto.token){
            allowedAmount = await this.getAllowedAmount({ token: dto.token, network: dto.network }, user);
        }
        else{
            allowedAmount = await this.getAllowedAmount({ token: withdraw.token, network: withdraw.network }, user)
        }
        if(Number(dto.amount)<=Number(allowedAmount)){
            const result = await this.withdrawRepo.update(id, {...dto});
            if(result.affected == 1){
                return await this.checkWithdrawById(id);
            }
            throw new NotFoundException(`Withdraw with id ${id} not found`);
            
        }
        throw new BadRequestException('Your requested amount is less than your payments');
    }

    async checkWithdrawById(id: number){
        const withdraw = await this.withdrawRepo.findOne({
            where:{
                id: id
            }
        });
        if(!withdraw){
            throw new NotFoundException(`Withdraw with id ${id} not found`);
        }
        return withdraw;

    }
}