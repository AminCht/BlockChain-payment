import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable,
    ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User.entity";

export enum Status{
    SUCCESSFUL = 'Successful',
    PENDING = 'Pending',
    CANCEL = 'Failed',
    APPROVED = 'Apporved'
}

@Entity({name: 'Withdraws'})
export class Withdraw{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: Status.PENDING })
    status: Status
    
    @Column()
    amound: string
    
    @Column()
    token: string

    @Column()
    network: string

    @Column()
    dst_wallet: string

    @Column()
    tx_hash: string

    @Column()
    tx_url: string

    @ManyToOne(() => User, (user) => user.transactions)
    user: User;

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