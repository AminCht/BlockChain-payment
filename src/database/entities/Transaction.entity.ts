import { BeforeInsert, CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, OneToOne,  JoinColumn } from 'typeorm';
import { Wallet } from './Wallet.entity';

enum Network {
    ETHEREUM = 'Ethereum',
        MAIN = 'main',
}


@Entity({ name: 'Transctions' })
export class Transaction{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false })
    amount: string

    @Column({nullable: false})
    network: string

    @Column({nullable:false})
    currency: string

    @OneToOne(() => Wallet, (wallet) => wallet.transaction,{cascade:true})
    @JoinColumn()
    wallet: Wallet

    @Column({default: 'Pending'})
    status: string

    @Column({nullable: false })
    wallet_balance_before: string

    @Column({nullable: true })
    wallet_balance_after: string

    @CreateDateColumn()
    createdDate: Date;

    @Column()
    expireTime: Date;

    @BeforeInsert()
    setExpirationTime(){
        this.expireTime =new Date();
        this.expireTime.setHours(this.expireTime.getHours()+1)
    }

}
/*
id amount network currency status wallet_id wallet_balance_before created_date expire_time wallet_balance_after*/
