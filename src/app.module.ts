import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from './payment/payment.module';
import DatabaseModule from './database/database.module';

@Module({
  imports: [DatabaseModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
