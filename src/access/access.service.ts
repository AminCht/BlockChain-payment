import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../database/entities/Currency.entity';
import { User } from '../database/entities/User.entity';

@Injectable()
export class AccessService {
    constructor(
        @InjectRepository(Currency)
        private currencyRepo: Repository<Currency>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}
    public async getAllTokens(): Promise <Object> {
        try {
            const tokens = await this.currencyRepo.find({
                where:{
                    status: true
                }
            });
            if(tokens.length == 0){
                return {message: "Currently we don't support any tokens. try again later"}
            }
            return tokens;
        }
        catch (error) {
            console.log(error);
        }
    }

    public async getAllUserAccess(userId: number): Promise <Currency[]>{
        console.log(userId)
        const user = await this.userRepo.findOne({
            relations: ['tokens'],
            where:{
                id:userId
            }
        });
        return user.tokens;
    }
}
