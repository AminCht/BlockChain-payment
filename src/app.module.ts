import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import { TokenService } from './token/token.service';
import { TokenModule } from './token/token.module';
import { AdminModule } from './admin/admin.module';
import { CurrencyModule } from './currency/currency.module';
import { ApikeyModule } from './apikey/apikey.module';
import { WithdrawModule } from './withdraw/withdraw.module';
import { BalanceModule } from './balance/balance.module';
import DatabaseModule from './database/database.module';

@Module({
    imports: [DatabaseModule, PaymentModule, WalletModule, TransactionModule, AuthModule, TokenModule, AdminModule, CurrencyModule, ApikeyModule, WithdrawModule, BalanceModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
