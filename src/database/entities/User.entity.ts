import {
    BeforeInsert,
    BeforeUpdate,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { Transaction } from './Transaction.entity';
import {Token} from "./Token";

@Entity({ name: 'Users' })
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @OneToMany(() => Transaction, (transaction) => transaction.wallet)
    transactions: Transaction[];

    @ManyToMany(() => Token)
    @JoinTable()
    tokens: Token[];

    @BeforeInsert()
    setDates() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
