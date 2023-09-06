import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Currency } from "../database/entities/Currency.entity";
import { User } from "../database/entities/User.entity";
import { Transaction } from "../database/entities/Transaction.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Transaction])],
    controllers: [BalanceController],
    providers: [BalanceService],
})
export class BalanceModule {}
