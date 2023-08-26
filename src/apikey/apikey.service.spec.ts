import { Test, TestingModule } from '@nestjs/testing';
import { ApikeyService } from './apikey.service';
import { User } from '../database/entities/User.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from '../database/entities/apikey.entity';
import { EndPointAccess } from '../database/entities/endpoint_acess.entity';
import { ApiKeyAuthGuard } from './guard/apikey.guard';
import { ApiKeyStrategy } from './strategy/apikey.strategy';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Repository } from 'typeorm';
import { Transaction } from '../database/entities/Transaction.entity';

describe('ApikeyService', () => {
    let service: ApikeyService;
    let userRepository: Repository<User>;
    let user;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [TypeOrmModule.forFeature([ApiKey, User, EndPointAccess])],
            providers: [
                ApikeyService,
                ApiKeyAuthGuard,
                ApiKeyStrategy,
                String,
                JwtStrategy,
                JwtAuthGuard,
            ],
        }).compile();

        service = module.get<ApikeyService>(ApikeyService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        user = await userRepository.findOne({ where: { id: 1 } });
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('getApiKeys', () => {
        it('should return all currencies', async () => {});
    });
    describe('createApiKey', () => {
        it('create an api key', async () => {
            const dto = {
                endPointList: [1, 2],
            };
            const response = await service.createApiKey(user, dto);
            expect(response).not.toBeNull();
        });
    });
    describe('updateApiKey', () => {
        it('update an api key', async () => {
            const dto = {
                endPointList: [1, 2],
                status: false,
            };
            const response = await service.updateApiKey(user, dto, 1);
            expect(response).not.toBeNull();
        });
    });
    describe('deleteApiKey', () => {
        it('update an api key', async () => {
            const response = await service.deleteApiKey(user, 2);
            expect(response).not.toBeNull();
        });
    });
    describe('getApiKeyById', () => {
        it('update an api key', async () => {
            const dto = {
                endPointList: [1, 2],
          };
            const response = await service.getApiKeysById(user, 1);
            expect(response).not.toBeNull();
        });
    });
});
