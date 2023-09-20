import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawService } from './withdraw.service';
import {getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import { Withdraw } from '../database/entities/withdraw.entity';
import { User } from '../database/entities/User.entity';
import { Transaction } from '../database/entities/Transaction.entity';
import { Currency } from '../database/entities/Currency.entity';
import DatabaseModule from '../database/database.module';
import {Repository} from "typeorm";

describe('WithdrawService', () => {
    let service: WithdrawService;
    let userRepository: Repository<User>;
    let user: User;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                DatabaseModule,
                TypeOrmModule.forFeature([Withdraw, User, Transaction, Currency]),
            ],
            providers: [WithdrawService],
        }).compile();

        service = module.get<WithdrawService>(WithdrawService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        user = await userRepository.findOne({ where: { id: 1 } });
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('getAllWithdraws', () => {
        it('should return all withdraws of a user', async () => {
            const allWithdraws = await service.getAllWithdraws(1);
            expect(allWithdraws).toBeDefined();
        });
    });
    describe('createWithdraw', () => {
        it('should create a withdraw', async () => {
            const withdrawDto = {
                amount: '1',
                currencyId: 1,
                dst_wallet: '123abc',
            };
            const withdraw = await service.createWithdraw(withdrawDto, user);
            expect(withdraw.status).toBe(1);
    });
  });
    describe('updateWithdraw', () => {
        it('should create a withdraw', async () => {
        const updateDto = {
                amount: '2',
        }
        const update = await service.updateWithdraw(updateDto,1,user);
        expect(update.amount).toBe('2000000000000000000');
    });
  });
});
