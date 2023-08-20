import { CreateWalletCommand } from './createWalletCommand';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../database/entities/Wallet.entity';
import databaseModule from '../database/database.module';
import { CheckBalanceCommand } from './checkBalanceCommand';
import { Transaction } from '../database/entities/Transaction.entity';
import { User } from '../database/entities/User.entity';
import { TestSeederCommand } from './testSeederCommand';
import { AuthService } from '../auth/auth.service';
import { CreateAdminCommand } from './createAdminCommand';
import {Currency} from "../database/entities/Currency.entity";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [databaseModule, TypeOrmModule.forFeature([Wallet,Transaction,User,Currency]),
    JwtModule.register({secret: process.env.JWT_SECRET,signOptions: { expiresIn: '20d' }}),
    ],
  providers: [CreateWalletCommand, CheckBalanceCommand, TestSeederCommand, AuthService,CreateAdminCommand],
})
export class CommandModule {}
