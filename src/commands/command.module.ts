import { CreateWalletCommand } from './CreateWalletCommand';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../database/entities/Wallet.entity';
import databaseModule from '../database/database.module';

@Module({
  imports: [databaseModule, TypeOrmModule.forFeature([Wallet])],
  providers: [CreateWalletCommand],
})
export class CommandModule {}
