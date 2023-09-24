import { Module } from '@nestjs/common';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '../database/entities/Currency.entity';
import { HttpModule } from '@nestjs/axios';
import { ApiKeyAuthGuard } from '../apikey/guard/apikey.guard';
import { EitherGuard } from '../apikey/guard/either.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Currency]), HttpModule],
  controllers: [CurrencyController],
  providers: [CurrencyService,EitherGuard, ApiKeyAuthGuard, JwtAuthGuard]
})
export class CurrencyModule {}
