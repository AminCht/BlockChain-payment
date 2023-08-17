import { Module } from '@nestjs/common';
import { AccessController } from './access.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../database/entities/Token.entity';
import { AccessService } from './access.service';
import { User } from '../database/entities/User.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Token,User])],
    controllers: [AccessController],
    providers: [AccessService],
})
export class AccessModule {}
