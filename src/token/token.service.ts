import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../database/entities/Currency.entity';
import { User } from '../database/entities/User.entity';
import { GetTokensResponseDto } from './dto/getTokens.dto';

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(Currency)
        private currencyRepo: Repository<Currency>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}
    public async getAllSupportedTokens(): Promise<Currency[]> {
        const tokens = await this.currencyRepo.find({
            where: { status: true },
        });
        return tokens;
    }

    public async getAllUserAccess(userId: number): Promise<GetTokensResponseDto[]> {
        const user = await this.userRepo.findOne({
            relations: ['tokens'],
            where: { id: userId },
        });
        return GetTokensResponseDto.tokens(user.tokens);
    }
}
