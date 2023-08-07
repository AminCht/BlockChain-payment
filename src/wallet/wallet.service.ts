import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'ethers';
import { Repository } from 'typeorm';
import { Wallet as WalletEntity }  from '../database/entities/Wallet.entity';

@Injectable()
export class WalletService {
    constructor( @InjectRepository(WalletEntity) private walletRepo: Repository<WalletEntity>){}
    async createWallet(){
        const wallet = Wallet.createRandom();
        const createdWallet = await this.walletRepo.create({
            private_key: wallet.privateKey,
            address:wallet.address,

        });
        
    }
}
