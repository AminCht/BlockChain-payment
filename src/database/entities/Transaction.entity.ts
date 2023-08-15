import { BeforeInsert, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Wallet } from './Wallet.entity';
import { User } from './user.entity';
 export enum Status {
    PENDING = 'Pending',
    SUCCESSFUL = 'Successful',
    FAILED = 'Failed'
}


@Entity({ name: 'Transactions' })
export class Transaction{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false })
    amount: string;

    @Column({nullable: false})
    network: string;

    @Column({nullable:false})
    currency: string;

    @Column({ type: 'enum', enum: Status, default: 'Pending' })
    status: string;

    @Column({nullable: false })
    wallet_balance_before: string;

    @Column({nullable: true })
    wallet_balance_after: string;

    @Column()
    createdDate: Date;

    @Column()
    expireTime: Date;

    @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
    wallet: Wallet

    @ManyToOne(()=> User, (user)=> user.transactions)
    user: User

    @BeforeInsert()
    setTimes() {
        this.createdDate = new Date();
        this.expireTime = new Date(this.createdDate.getTime() + 60 * 60 * 1000);
    }
}
