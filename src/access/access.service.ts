import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../database/entities/Currency.entity';
import { User } from '../database/entities/User.entity';
import {GetTokensResponseDto} from "./dto/getTokens.dto";

@Injectable()
export class AccessService {
    constructor(
        @InjectRepository(Currency)
        private currencyRepo: Repository<Currency>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}
    public async getAllTokens(): Promise<Currency[]> {
        try {
            const tokens = await this.currencyRepo.find({
                select: ['network', 'symbol', 'name', 'status'],
            });
            if (tokens.length == 0) {
                throw new NotFoundException(
                    'Currently we dont support any tokens. try again later',
                );
            }
            return tokens;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    public async getAllUserAccess(userId: number): Promise<GetTokensResponseDto[]> {
        const user = await this.userRepo.findOne({
            relations: ['tokens'],
            where: { id: userId },
        });
        const tokens = user.tokens.map((token) => {
            return {
                network: token.network,
                symbol: token.symbol,
                name: token.name,
                status: token.status,
            };
        });
        return tokens;
    }
}
