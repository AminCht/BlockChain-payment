import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../database/entities/Token.entity';

@Injectable()
export class AccessService {
    constructor(
        @InjectRepository(Token)
        private tokenRepo: Repository<Token>,
    ) {}
    public async getAllTokens() {
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
    public async getUserTokens(){
        
    }

    public async getAllAccesses(){}
}
