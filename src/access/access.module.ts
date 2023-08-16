import { Module } from '@nestjs/common';
import { AccessController } from './access.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../database/entities/Token.entity';
import { AccessService } from './access.service';

@Module({
    imports: [TypeOrmModule.forFeature([Token])],
    controllers: [AccessController],
    providers: [AccessService],
})
export class AccessModule {}
