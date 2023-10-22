import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../database/entities/Ticket.entity';
import { JwtAdminAuthGuard } from '../auth/guards/jwt.admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../database/entities/User.entity';
import { JwtService } from '@nestjs/jwt';
import { Message } from '../database/entities/Message.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Ticket, User, Message])],
  controllers: [TicketController],
  providers: [TicketService, JwtAdminAuthGuard, JwtAuthGuard, JwtService],
})
export class TicketModule {}
