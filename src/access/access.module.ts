import { Module } from '@nestjs/common';
import { AccessController } from './access.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '../database/entities/Currency.entity';
import { AccessService } from './access.service';
import { User } from '../database/entities/User.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Currency,User])],
    controllers: [AccessController],
    providers: [AccessService],
})
export class AccessModule {}
