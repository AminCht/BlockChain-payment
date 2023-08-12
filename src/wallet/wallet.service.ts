import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet as WalletEntity }  from '../database/entities/Wallet.entity';
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
        console.log(wallet);
        if(wallet){
            return await this.paymentService.getWalletBalance(address);
        }
        throw new WalletNotFoundException(address);
    }
    

        
}
