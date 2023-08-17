import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../database/entities/Token.entity';
import { User } from '../database/entities/User.entity';

@Injectable()
export class AccessService {
    constructor(
        @InjectRepository(Token)
        private tokenRepo: Repository<Token>,
        @InjectRepository(Token)
        private userRepo: Repository<User>,
    ) {}
    public async getAllTokens(): Promise <Object> {
        try {
            const tokens = await this.tokenRepo.find({
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

    public async getAllUserAccess(userId: number): Promise <User[]>{
        const user = await this.userRepo.find({
            relations: ['tokens'],
            where:{
                id:userId
            }
        });
        return user;
    }
}
