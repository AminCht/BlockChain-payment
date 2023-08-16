import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import {getRepositoryToken, InjectRepository, TypeOrmModule} from '@nestjs/typeorm';
import { Wallet } from '../database/entities/Wallet.entity';
import { Transaction } from '../database/entities/Transaction.entity';
import DatabaseModule from '../database/database.module';
import { Currency, Network } from './dto/createPayment.dto';
import { User } from '../database/entities/User.entity';
import { Repository } from 'typeorm';
describe('PaymentService', () => {
    let service: PaymentService;
    let getWalletBalanceMock: jest.SpyInstance<Promise<string>>;
    let userRepo: Repository<User>;
    let walletRepo: Repository<Wallet>;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                DatabaseModule,
                TypeOrmModule.forFeature([Wallet, Transaction, User]),
            ],
            providers: [PaymentService],
        }).compile();
        service = module.get<PaymentService>(PaymentService);
        userRepo = module.get<Repository<User>>(getRepositoryToken(User));
        walletRepo = module.get<Repository<Wallet>>(getRepositoryToken(Wallet));
        jest.spyOn(service, 'getBalance').mockReturnValue(Promise.resolve('1'));
        jest.spyOn(service, 'getTokenBalance').mockReturnValue(Promise.resolve('1'));
    });
    const request = {
        user: {
            id: 1,
        },
    };
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create transaction', () => {
        it('should create a eth payment and return wallet address and id', async () => {
            const paymentDto = {
                network: Network.ETHEREUM,
                currency: Currency.ETH,
                amount: '12',
            };
            const payment = await service.createPayment(request, paymentDto);
            expect(payment.walletAddress).toBeDefined();
        });
        it('should create a token payment on ethereum network and return wallet address and id', async () => {
            const paymentDto = {
                network: Network.ETHEREUM,
                currency: Currency.USDT,
                amount: '12',
            };
            const payment = await service.createPayment(request, paymentDto);
            expect(payment.walletAddress).toBeDefined();
        });
    });
    describe('get Transaction by id', () => {
        it('should return transaction', async () => {
            const transactionId = 1;
            const transaction = await service.getTransactionById(transactionId);
            expect(transaction).toBeDefined();
        });
        it('should return error', async () => {
            const transactionId = 10;
            const transaction = await service.getTransactionById(transactionId);
            expect(transaction).toBeNull();
        });
        it('should return 404', async () => {
            const transactionId = 10;
            try {
                await service.getTransactionById(transactionId);
            } catch (error) {
                expect(error.response.statusCode).toBe(404);
            }
        });
    });
});
