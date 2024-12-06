import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable,
    ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { User } from './User.entity';
import { EndPointAccess } from './endpoint_acess.entity';

@Entity({name: 'ApiKeys'})
export class ApiKey{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    key: string;

    @Column({ default: 1 })
    status: boolean;

    @Column()
    expireTime: Date;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
    @ManyToOne(() => User, (user) => user.apikies)
    user: User;

    @ManyToMany(() => EndPointAccess, (endpoint) => endpoint.apikies)
    @JoinTable({ name: 'apikey_endpoint' })
    accesses: EndPointAccess[];

    @BeforeInsert()
    private setTimes() {
        const date = new Date();
        this.createdAt = date;
        this.updatedAt = date;
        const expireTime = date;
        expireTime.setDate(this.createdAt.getDate() + 20);
        this.expireTime = expireTime;
    }
    @BeforeUpdate()
   private setUpdateTime() {
        this.updatedAt = new Date();
    }
}