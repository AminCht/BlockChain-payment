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
            return await this.tokenRepo.find();}
        catch (error) {
            console.log(error);
        }
    }
    public async getUserTokens(){}

    public async getAllAccesses(){}
}
