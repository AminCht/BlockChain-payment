import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet as WalletEntity } from '../database/entities/Wallet.entity';
import { PaymentService } from '../payment/payment.service';
import { WalletNotFoundException } from './exceptions/walletnotfound.exception';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(WalletEntity) private walletRepo: Repository<WalletEntity>,
        private readonly paymentService: PaymentService
    ){}

    async getWalletBalance(address: string){
        const wallet = await this.walletRepo.findOne({
            where:{
                address:address
            }
        });
        //todo
        /*if(wallet){
            return await this.paymentService.getBalance(address);
        }
        throw new WalletNotFoundException(address);*/
    }
}
