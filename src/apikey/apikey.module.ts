import { Module } from '@nestjs/common';
import { ApikeyController } from './apikey.controller';
import { ApikeyService } from './apikey.service';
import { ApiKeyStrategy } from './strategy/apikey.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from '../database/entities/apikey.entity';
import { ApiKeyAuthGuard } from './guard/apikey.guard';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { User } from '../database/entities/User.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey, User])],
  controllers: [ApikeyController],
  providers: [ApikeyService, ApiKeyAuthGuard, ApiKeyStrategy, String, JwtStrategy, JwtAuthGuard]
})
export class ApikeyModule {}
