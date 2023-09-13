import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Status as withdrawStatus, Withdraw} from '../database/entities/withdraw.entity';
import {Repository} from 'typeorm';
import {CreateWithdrawDto, UpdateWithdrawRequestDto} from './dto/withdraw.dto';
import {User} from '../database/entities/User.entity';
import {Status, Transaction} from '../database/entities/Transaction.entity';
import {Currency} from "../database/entities/Currency.entity";
import {ethereumTokenAddresses} from "../payment/tokenAddresses/EthereumTokenAddresses";
import {Contract, ethers, InfuraProvider} from "ethers";

@Injectable()
export class WithdrawService {
    private tokenContract: Contract;
    private readonly provider: InfuraProvider;
    private readonly tokenABI = ['function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)'];
    constructor (
        @InjectRepository(Withdraw) private withdrawRepo: Repository<Withdraw>,
        @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,
        @InjectRepository(Currency) private currencyRepo: Repository<Currency>,
        )
    {
        this.provider = new InfuraProvider(process.env.NETWORK, process.env.API_KEY);
    }

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
        const currency = await this.currencyRepo.findOneById(dto.currencyId);
        const allowedAmount = await this.getAllowedAmount(currency, user);
        const requestedAmount = ethers.parseUnits(dto.amount, currency.decimals);
        console.log(allowedAmount);
        console.log(requestedAmount);
        if (BigInt(requestedAmount) <= BigInt(allowedAmount)) {
            const withdraw = this.withdrawRepo.create({
                amount: String(requestedAmount),
                currency: currency,
                dst_wallet: dto.dst_wallet,
                user: user,
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
        let requestedAmount;
        if (dto.currencyId) {
            //const withdraw = await this.getWithdrawById(id);
            const currency = await this.currencyRepo.findOneById(dto.currencyId);
            allowedAmount = await this.getAllowedAmount(currency, user);
            requestedAmount = ethers.parseUnits(dto.amount, currency.symbol);
        }
        if (!allowedAmount || BigInt(requestedAmount) <= BigInt(allowedAmount)) {
            dto.amount = requestedAmount;
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
    private async getAllowedAmount(currency: Currency, user: User): Promise <bigint>{
        const transactionsAmount = await this.getAllSuccessfulTransactions(currency, user)
        const acceptedWithdrawAmount = await this.getAllAcceptedWithDraw(currency, user);
        return transactionsAmount - acceptedWithdrawAmount;
    }

    private async getAllSuccessfulTransactions(currency:Currency, user: User): Promise <bigint>{
        const successfulTransactions = await this.transactionRepo.createQueryBuilder('transaction')
            .where('transaction.userId=:userId', { userId: user.id })
            .andWhere('transaction.currencyId=:token', { token: currency.id })
            .andWhere('transaction.status=:status', { status: Status.SUCCESSFUL })
            .select(['transaction.amount'])
            .getMany();
        let sumOfAmounts: bigint= BigInt(0);
        for( var transaction of successfulTransactions){
            sumOfAmounts += BigInt(transaction.amount);
        }
        return BigInt(sumOfAmounts);
    }
    private async getAllAcceptedWithDraw( currency: Currency,user: User): Promise <bigint>{
        const acceptedwithdraw = await this.withdrawRepo.createQueryBuilder('withdraw')
        .leftJoinAndSelect('withdraw.user', 'user')
          .leftJoinAndSelect('withdraw.currency', 'currency')
        .where('withdraw.userId=:userId',{userId: user.id})
        .andWhere('withdraw.status=:status', {status: withdrawStatus.SUCCESSFUL})
        .andWhere('withdraw.currencyId=:currency', {currency: currency.id})
        .select(['amount'])
        .getMany();
        let sumOfAmounts: bigint = BigInt(0);
        for(const withdraw of acceptedwithdraw){
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