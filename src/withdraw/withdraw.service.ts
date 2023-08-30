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

    public async getAllWithdraws(userId: number): Promise<Withdraw[]> {
        return await this.withdrawRepo.find({
            where: { user: { id: userId } },
        });
    }
    public async createWithdraw(dto: CreateWithdrawDto, user: User): Promise<Withdraw>{
        const withdraw = await this.getPendingWithdraw(user.id);
        if (withdraw) {
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
        throw new BadRequestException('Your requested amount is more than your payments');

    }
    public async cancelWithdraw(id: number): Promise<Withdraw> {
        const result = await this.withdrawRepo.update(id,{
            status: withdrawStatus.CANCEL
        });
        if(result.affected == 1){
            return await this.getWithdrawById(id);
        }
        throw new NotFoundException(`Withdraw with id ${id} not found`);
    }

    public async updateWithdraw(dto: UpdateWithdrawRequestDto, id: number,user: User): Promise<Withdraw>{
        let allowedAmount;
        if (dto.amount || dto.token || dto.network) {
            const withdraw = await this.getWithdrawById(id);
            allowedAmount = await this.getAllowedAmount(
            { token: dto.token ?? withdraw.token, network: dto.network?? withdraw.network }, user);}
        if (!allowedAmount || Number(dto.amount) <= Number(allowedAmount)) {
            const result = await this.withdrawRepo.update(id, { ...dto });
            if(result.affected == 1){
                return await this.getWithdrawById(id);
            }
            throw new NotFoundException(`Withdraw with id ${id} not found`);
        }
        throw new BadRequestException('Your requested amount is more than your payments');
    }
    private async getPendingWithdraw(userId: number): Promise<Withdraw>{
        const withDraw = await this.withdrawRepo.findOne({
            where:{
                status: withdrawStatus.PENDING || withdrawStatus.APPROVED,
                user: { id: userId },
            },
        });
        return withDraw;
    }
    private async getAllowedAmount(currency: {token: string, network: string}, user: User): Promise <bigint>{
        const transactionsAmount = await this.getAllSuccessfulTransactions(currency, user)
        const acceptedWithdrawAmount = await this.getAllAcceptedWithDraw(user);
        return transactionsAmount - acceptedWithdrawAmount;
    }
    
    private async getAllSuccessfulTransactions(currency: {token: string, network: string}, user: User): Promise <bigint>{
        const successfulTransactions = await this.transactionRepo.createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.currency', 'currency')
        .where('transaction.userId=:userId',{userId: user.id})
        .andWhere('currency.symbol=:token', {token: currency.token})
        .andWhere('currency.network=:network', {network: currency.network})
        .andWhere('transaction.status=:status', {status: Status.SUCCESSFUL})
        .select(['transaction.amount']).getMany();
        let sumOfAmounts: bigint= BigInt(0);
        for( var transaction of successfulTransactions){
            sumOfAmounts += BigInt(transaction.amount);
        }
        return BigInt(sumOfAmounts); 
    }
    
    private async getAllAcceptedWithDraw(user: User): Promise <bigint>{
        const acceptedwithdraw = await this.withdrawRepo.createQueryBuilder('withdraw')
        .leftJoinAndSelect('withdraw.user', 'user')
        .where('withdraw.userId=:userId',{userId: user.id})
        .andWhere('withdraw.status=:status', {status: withdrawStatus.SUCCESSFUL})
        .select(['amount'])
        .getMany();
        let sumOfAmounts: bigint = BigInt(0);
        for( var withdraw of acceptedwithdraw){
            sumOfAmounts += BigInt(withdraw.amount);
        }
        return BigInt(sumOfAmounts); 
    }
    private async getWithdrawById(id: number): Promise<Withdraw>{
        const withdraw = await this.withdrawRepo.findOne({
            where: { id: id },
        });
        if (!withdraw) {
            throw new NotFoundException(`Withdraw with id ${id} not found`);
        }
        return withdraw;

    }
}