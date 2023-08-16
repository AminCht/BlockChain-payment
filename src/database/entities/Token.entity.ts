import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "./User.entity";

@Entity('Tokens')
export class Token{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    network: string;

    @Column({ unique: true })
    currency: string;

    @Column()
    wallet_network: string;

    @Column({ default: true })
    status: boolean;
    @ManyToMany(() => User, (user) => user.tokens)
    @JoinTable({ name: 'tokens_users' })
    users: User[];
}
