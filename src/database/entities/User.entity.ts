import {
    BeforeInsert,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { Transaction } from './Transaction.entity';
import { Token } from './Token.entity';

@Entity({ name: 'Users' })
export class User {
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

    @ManyToMany(() => Token, (token) => token.users)
    tokens: Token[];

    @BeforeInsert()
    setDates() {
        const date = new Date();
        this.createdAt = date;
        this.updatedAt = date;
    }
}
