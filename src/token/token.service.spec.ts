import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Currency} from "../database/entities/Currency.entity";
import {User} from "../database/entities/User.entity";
import DatabaseModule from "../database/database.module";

describe('AccessService', () => {
    let service: TokenService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule,TypeOrmModule.forFeature([Currency, User])],
            providers: [TokenService],
        }).compile();

        service = module.get<TokenService>(TokenService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should return all tokens', async () => {
        const tokens = await service.getAllSupportedTokens();
        expect(tokens).toBeDefined();
    });
});
