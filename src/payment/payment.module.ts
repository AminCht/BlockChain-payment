import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Wallet} from "../database/entities/Wallet.entity";
import {Transaction} from "../database/entities/Transaction.entity";
import { TransactionService } from '../transaction/transaction.service';
import { User } from '../database/entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction,User])],
  controllers: [PaymentController],
  providers: [PaymentService,TransactionService],
})
export class PaymentModule {}
