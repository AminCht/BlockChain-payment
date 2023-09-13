import { BeforeInsert, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Wallet } from './Wallet.entity';
import { User } from './User.entity';
import { Currency } from './Currency.entity';
export enum Status {
    PENDING = 0,
    SUCCESSFUL = 1,
    FAILED = 2
}


@Entity({ name: 'Transactions' })
export class Transaction{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false })
    amount: string;

    @Column({ default: Status.PENDING })
    status: Status;

    @Column({ nullable: false })
    wallet_balance_before: string;

    @Column({ nullable: true })
    wallet_balance_after: string;

    @Column()
    created_date: Date;

    @Column()
    expireTime: Date;

    @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
    wallet: Wallet;

    @ManyToOne(() => User, (user) => user.transactions)
    user: User;

    @ManyToOne(() => Currency, (currency) => currency.transactions)
    currency: Currency;

    @BeforeInsert()
    setTimes() {
        this.created_date = new Date();
        this.expireTime = new Date(this.created_date.getTime() + 60 * 60 * 1000);
    }
}
