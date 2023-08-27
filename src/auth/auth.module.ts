import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/User.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAdminStrategy } from './strategy/jwt.admin.startegy';

@Module({
  imports: [JwtModule.register({secret: process.env.JWT_SECRET,signOptions: { expiresIn: '20d' }}),
  TypeOrmModule.forFeature([User]) ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy, JwtAdminStrategy]
})
export class AuthModule {}
