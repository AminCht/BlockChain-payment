import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import { AccessService } from './access/access.service';
import { AccessModule } from './access/access.module';
import DatabaseModule from './database/database.module';

@Module({
    imports: [DatabaseModule, PaymentModule, WalletModule, TransactionModule, AuthModule, AccessModule],
    controllers: [AppController],
    providers: [AppService, AccessService],
})
export class AppModule {}
