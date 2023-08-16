import {
    BeforeInsert,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { Transaction } from './Transaction.entity';
import { TokenEntity } from './Token.entity';

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

    @ManyToMany(() => TokenEntity, (token) => token.users)
    tokens: TokenEntity[];

    @BeforeInsert()
    setDates() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
