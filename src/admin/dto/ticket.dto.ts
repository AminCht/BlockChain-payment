import { Message } from "../../database/entities/Message.entity"
import { Ticket } from "../../database/entities/Ticket.entity"
import { User } from "../../database/entities/User.entity"

export enum Status{
    OPEN=0,
    CLOSE=1
}
export class GetTicketResponseDto{

    id: number

    subject: string

    status: string

    user: User

    message: Message[]

    static entityToDto(ticket: Ticket){
        const ticketResponseDto = new GetTicketResponseDto()
        ticketResponseDto.id = ticket.id
        ticketResponseDto.subject = ticket.subject;
        ticketResponseDto.status = ticketResponseDto.convertStatus(ticket.status);
        delete ticket.user.password
        ticketResponseDto.user = ticket.user;
        ticketResponseDto.message = ticket.messages;
        return ticketResponseDto;
    }

    public convertStatus(status: number){
        if(status === 0){
            return 'Open';
        }
        return 'Close';
    }
}