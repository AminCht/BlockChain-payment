import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";


@Entity({name: 'ApiKeys'})
export class ApiKey{
    @PrimaryGeneratedColumn()   
    id: number

    @Column({ unique: true })
    key: string

    @Column({ default: 1 })
    status: boolean

    @Column()
    expireTime ?: Date

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date

    @ManyToOne(() => User, (user) => user.apikies)
    user: User;

    @BeforeInsert()
    setTimes() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}   