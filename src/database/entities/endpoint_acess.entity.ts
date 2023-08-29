import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiKey } from "./apikey.entity";

@Entity({ name: 'EndPointAcesses'})
export class EndPointAccess{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @ManyToMany(() => ApiKey, (apikey) => apikey.accesses)
    apikies: ApiKey[];
}