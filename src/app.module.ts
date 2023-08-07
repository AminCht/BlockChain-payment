import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from './payment/payment.module';
import { WalletModule } from './wallet/wallet.module';
import DatabaseModule from './database/database.module';

@Module({
  imports: [DatabaseModule, PaymentModule, WalletModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
