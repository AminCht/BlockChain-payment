import { flatten } from '@nestjs/common';
import { BeforeInsert, CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinTable, JoinColumn } from 'typeorm';
import { Wallet } from './Wallet.entity';

enum Network{
  ETHEREUM = 'Ethereum',
    MAIN="main"
}


@Entity({name:"Transctions"})
export class Transaction{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  amount: number

    @Column({nullable: false})
    network: string

    @Column({nullable:false})
    currency: string

    @OneToOne(() => Wallet, (wallet) => wallet.transaction,{cascade:true})
    @JoinColumn()
    wallet: Wallet
    
    @Column({ type: 'double', scale: 2, nullable: false })
    wallet_balance_before: number

    @Column({ type: 'double', scale: 2, nullable: false })
    wallet_balance_after: number

    @CreateDateColumn()
    createdDate: Date;

    @Column()
    expireTime: Date;
    
    @BeforeInsert()
    setExpirationTime(){
        const currentDateTime = new Date()
        this.expireTime.setHours(currentDateTime.getHours()+1)
    }

}
/*
id amount network currency status wallet_id wallet_balance_before created_date expire_time wallet_balance_after*/