import { Module } from '@nestjs/common';
import { WithdrawController } from './withdraw.controller';
import { WithdrawService } from './withdraw.service';
import { Withdraw } from '../database/entities/withdraw.entity';
import { User } from '../database/entities/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../database/entities/Transaction.entity';
import { Currency } from '../database/entities/Currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Withdraw, User, Transaction, Currency])],
  controllers: [WithdrawController],
  providers: [WithdrawService]
})
export class WithdrawModule {}
