import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Wallet} from "../database/entities/Wallet.entity";
import {Transaction} from "../database/entities/Transaction.entity";
import { TransactionService } from '../transaction/transaction.service';
import { User } from '../database/entities/User.entity';
import { AccessService } from '../access/access.service';
import { Currency } from '../database/entities/Currency.entity';
import { EitherGuard } from '../apikey/guard/either.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiKeyAuthGuard } from '../apikey/guard/apikey.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction,User, Currency])],
  controllers: [PaymentController],
  providers: [PaymentService,TransactionService,AccessService, EitherGuard, JwtAuthGuard, ApiKeyAuthGuard],
})
export class PaymentModule {}
