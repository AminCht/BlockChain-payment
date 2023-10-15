import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ticket } from "./Ticket.entity";


@Entity( {name: 'Messages'})
export class Message{

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Ticket, (ticket) => ticket.messages)
    ticket: Ticket;

    @Column()
    senderId: number

    @Column()
    recieverId: number

    @Column()
    text: string
}