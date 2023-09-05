import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/User.entity';
import { AuthService } from '../auth/auth.service';
import { JwtAdminStrategy } from '../auth/strategy/jwt.admin.startegy';
import { Withdraw } from '../database/entities/withdraw.entity';
import { Wallet } from '../database/entities/Wallet.entity';

@Module({
  imports:[JwtModule.register({secret: process.env.JWT_SECRET_ADMIN, signOptions: { expiresIn: '20d' }}),
  TypeOrmModule.forFeature([User, Withdraw, Wallet])],
  controllers: [AdminController],
  providers: [AdminService,JwtAdminStrategy, AuthService]
})
export class AdminModule {}
