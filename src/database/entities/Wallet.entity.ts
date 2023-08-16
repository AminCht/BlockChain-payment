import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './Transaction.entity';

@Entity('Wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  address: string;

  @Column({ unique: true })
  private_key: string;

  @Column()
  wallet_network: string;
  
  @Column()
  type: string;

  @Column({default: false})
  lock: boolean;

  @Column({default: 1})
  status: boolean;
  
  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];
}
