import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./Message.entity";


@Entity({ name: 'Tickets'})
export class Ticket{

    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(()=> Message, (message)=> message.ticket)
    messages: Message[]

    @Column()
    subject: string
}