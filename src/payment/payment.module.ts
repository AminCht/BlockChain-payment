import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Wallet} from "../database/entities/Wallet.entity";
import {Transaction} from "../database/entities/Transaction.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}