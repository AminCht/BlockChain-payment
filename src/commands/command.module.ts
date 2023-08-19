import { CreateWalletCommand } from './createWalletCommand';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../database/entities/Wallet.entity';
import databaseModule from '../database/database.module';
import { CheckBallanceCommand } from './checkBalanceCommand';
import { Transaction } from '../database/entities/Transaction.entity';
import {User} from "../database/entities/User.entity";
import {TestSeederCommand} from "./testSeederCommand";
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [databaseModule, TypeOrmModule.forFeature([Wallet,Transaction,User])],
  providers: [CreateWalletCommand, , CheckBallanceCommand, TestSeederCommand, AuthService],
})
export class CommandModule {}
