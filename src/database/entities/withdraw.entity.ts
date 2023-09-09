import { BeforeInsert, BeforeUpdate, Column, Entity,  ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User.entity";
import { Currency } from "./Currency.entity";

export enum Status{
    SUCCESSFUL = 0,
    PENDING = 1,
    CANCEL = 2,
    APPROVED = 3
}

@Entity({name: 'Withdraws'})
export class Withdraw{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: Status.PENDING })
    status: Status
    
    @Column()
    amount: string
    @Column()
    dst_wallet: string

    @Column({ nullable: true })
    tx_hash: string

    @Column({ nullable: true })
    tx_url: string

    @ManyToOne(() => User, (user) => user.withdraws)
    user: User;
    @ManyToOne(() => Currency, (currency) => currency.withdraws)
    currency: Currency;

    @Column()
    created_At: Date

    @Column()
    updated_At: Date
   @BeforeInsert()
    private setTimes() {
        const date = new Date()
        this.created_At = date;
        this.updated_At = date;
    }
   @BeforeUpdate()
   private setUpdateTime() {
        const date = new Date();
        this.updated_At = date;
   }
}