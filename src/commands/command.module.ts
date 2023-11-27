import { CreateWalletCommand } from './createWalletCommand';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../database/entities/Wallet.entity';
import databaseModule from '../database/database.module';
import { CheckBalanceCommand } from './checkBalanceCommand';
import { Transaction } from '../database/entities/Transaction.entity';
import { User } from '../database/entities/User.entity';
import { TestSeederCommand } from './testSeederCommand';
import { CreateAdminCommand } from './createAdminCommand';
import {Currency} from "../database/entities/Currency.entity";
import {JwtModule} from "@nestjs/jwt";
import { AdminService } from '../admin/admin.service';
import { AuthService } from '../auth/auth.service';
import { AddAccessCommand } from './addAccessCommand';
import { EndPointAccess } from '../database/entities/endpoint_acess.entity';
import {Withdraw} from "../database/entities/withdraw.entity";
import { HttpModule } from '@nestjs/axios';
import { PaymentService } from '../payment/payment.service';
import { TransactionService } from '../transaction/transaction.service';
import { Ticket } from "../database/entities/Ticket.entity";
import { AddCurrencyCommand } from './addCurrencyCommand';

@Module({
  imports: [databaseModule, TypeOrmModule.forFeature([Wallet,Transaction,User,Currency, EndPointAccess,Withdraw,Ticket]),
    JwtModule.register({secret: process.env.JWT_SECRET,signOptions: { expiresIn: '20d' }}), HttpModule
    ],
  providers: [CreateWalletCommand, CheckBalanceCommand, TestSeederCommand, AdminService,AuthService, CreateAdminCommand, AddAccessCommand,
  PaymentService, TransactionService, AddCurrencyCommand],
})
export class CommandModule {}
