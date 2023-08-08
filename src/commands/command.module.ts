import { CreateWalletCommand } from './CreateWalletCommand';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../database/entities/Wallet.entity';
import databaseModule from '../database/database.module';
import { CheckBallanceCommand } from './checkBalanceCommand';
import { Transaction } from '../database/entities/Transaction.entity';

@Module({
  imports: [databaseModule, TypeOrmModule.forFeature([Wallet,Transaction])],
  providers: [CreateWalletCommand,CheckBallanceCommand],
})
export class CommandModule {}
