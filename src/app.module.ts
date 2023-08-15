import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from './payment/payment.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import DatabaseModule from './database/database.module';

@Module({
    imports: [DatabaseModule, PaymentModule, WalletModule, TransactionModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
