import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiKey } from "./apikey.entity";

export enum Acess{

}

@Entity({ name: 'EndPointAcesses'})
export class EndPointAccess{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: Acess

    @ManyToMany(() => ApiKey, (apikey) => apikey.accesses)
    apikies: ApiKey[];
}