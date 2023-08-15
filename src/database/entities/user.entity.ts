import { BeforeInsert, BeforeUpdate, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './Transaction.entity';

@Entity({ name: 'Users' })
export class User{

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    username: string

    @Column()
    password: string

    @Column()
    createdAt: Date

    @Column({default: null})
    updatedAt: Date

    @OneToMany(() => Transaction, (transaction) => transaction.wallet)
    transactions: Transaction[]

    @BeforeInsert()
    setDates(){
        this.createdAt = new Date();
    }
    @BeforeUpdate()
    setDate(){
        this.updatedAt = new Date();
    }
    
    
    
}