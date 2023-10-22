import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status, Ticket } from '../database/entities/Ticket.entity';
import { Role, User } from '../database/entities/User.entity';
import { CreateTicketRequestDto } from './dto/ticket.dto';
import { SendMessageRequestDto } from './dto/message.dto';
import { Message } from '../database/entities/Message.entity';

@Injectable()
export class TicketService {

    constructor(
        @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
        @InjectRepository(Message) private messageRepo: Repository<Message>
        ){}

    async createTicket(dto: CreateTicketRequestDto, user: User): Promise<Ticket>{
        const ticket = this.ticketRepo.create({subject: dto.subject, user: user});
        return await this.ticketRepo.save(ticket);
    }
    //todo pagination
    async getUserTickets(user: User){
        const ticket = await this.ticketRepo.find({ where: {user: {id: user.id}}});
        return ticket;
    }

    async closeTikcet(ticketId: number, user: User){
        await this.ticketRepo.createQueryBuilder().update().set({status: Status.CLOSE})
        .where('id = :id', { id: ticketId }).andWhere('userId= :userId', {userId: user.id}).execute()
        return this.getTicketById(ticketId, user)
    }

    async getTicketById(id: number, user: User){
        const ticket = await this.ticketRepo.findOne({where: {id: id, user:{id: user.id}}, relations: {messages: true}})
        if(!ticket){
            throw new NotFoundException(`Ticket with id ${id} not found`);
        }
        return ticket;
    }

    async sendMessage(dto: SendMessageRequestDto, ticketId: number, user: User){
        
        const ticket = await this.ticketRepo.findOne({where: {id: ticketId, user:{id: user.id}}});
        if(ticket || user.role ==Role.ADMIN){
            const message = this.messageRepo.create({ticket: {id: ticketId}, senderId: user.id, text: dto.text});
            return await this.messageRepo.save(message);
        }
        throw new ForbiddenException();
    }


}
