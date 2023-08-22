import { Module } from '@nestjs/common';
import { ApikeyController } from './apikey.controller';
import { ApikeyService } from './apikey.service';
import { ApiKeyStrategy } from './strategy/apikey.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from '../database/entities/apikey.entity';
import { ApiKeyAuthGuard } from './guard/apikey.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey])],
  controllers: [ApikeyController],
  providers: [ApikeyService, ApiKeyAuthGuard, ApiKeyStrategy, String]
})
export class ApikeyModule {}
