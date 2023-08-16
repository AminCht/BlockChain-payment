import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Tokens')
export class Token {
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
}
