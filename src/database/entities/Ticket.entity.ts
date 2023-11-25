import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./Message.entity";
import { User } from "./User.entity";

export enum Status {
    OPEN= 0,
    CLOSE=1
}
@Entity({ name: 'Tickets'})
export class Ticket{

    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(()=> Message, (message)=> message.ticket)
    messages: Message[]

    @ManyToOne(()=>User, (user)=>user.tickets)
    user:User

    @Column()
    subject: string

    @Column({default: Status.OPEN})
    status: Status
}