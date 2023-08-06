import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import {Transaction} from "./Transaction.entity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  address: string;
  @Column({ unique: true })
  private_key: string;
  @Column()
  network: string;
  @Column()
  type: string;
  @Column()
  lock: boolean;
  @Column()
  status: boolean;
  @OneToOne(() => Transaction)
  transaction: Transaction;
}
