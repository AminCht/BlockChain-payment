import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Wallet} from "../database/entities/Wallet.entity";
import { PaymentService } from '../payment/payment.service';
import { Transaction } from '../database/entities/Transaction.entity';
import { User } from '../database/entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet,Transaction, User])],
  providers: [WalletService, PaymentService],
  controllers: [WalletController],
})
export class WalletModule {}
