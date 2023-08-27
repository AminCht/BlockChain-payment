import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '../database/entities/Currency.entity';
import { TokenService } from './token.service';
import { User } from '../database/entities/User.entity';
import {EitherGuard} from "../apikey/guard/either.guard";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {ApiKeyAuthGuard} from "../apikey/guard/apikey.guard";

@Module({
    imports: [TypeOrmModule.forFeature([Currency, User])],
    controllers: [TokenController],
    providers: [TokenService, EitherGuard, JwtAuthGuard, ApiKeyAuthGuard],
})
export class TokenModule {}
