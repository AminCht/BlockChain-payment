import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique} from 'typeorm';
import { User } from './User.entity';


@Unique(['network', 'symbol'])
@Entity('currencies')
export class Currency {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    network: string;

    @Column({ nullable: false })
    name: string;
    @Column({ nullable: false })
    symbol: string;

    @Column({ default: true })
    status: boolean;
    @ManyToMany(() => User, (user) => user.tokens)
    @JoinTable({ name: 'currency_user' })
    users: User[];
}
