import {
    BeforeInsert,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { Transaction } from './Transaction.entity';
import { Currency } from './Currency.entity';

export enum Role{
    USER = 'User',
    ADMIN = 'Admin'
}

@Entity({ name: 'Users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ default: Role.USER })
    role: Role

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @OneToMany(() => Transaction, (transaction) => transaction.wallet)
    transactions: Transaction[];

    @ManyToMany(() => Currency, (token) => token.users)
    tokens: Currency[];

    @BeforeInsert()
    setDates() {
        const date = new Date();
        this.createdAt = date;
        this.updatedAt = date;
    }
}
