import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../database/entities/Wallet.entity';
import { Transaction } from '../database/entities/Transaction.entity';
import DatabaseModule from '../database/database.module';
import { User } from '../database/entities/User.entity';
describe('PaymentService', () => {
    let service: PaymentService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                DatabaseModule,
                TypeOrmModule.forFeature([Wallet, Transaction, User]),
            ],
            providers: [PaymentService],
        }).compile();
        service = module.get<PaymentService>(PaymentService);
        jest.spyOn(service, 'getEthBalance').mockReturnValue(Promise.resolve('1'));
        jest.spyOn(service, 'getEthTokenBalance').mockReturnValue(Promise.resolve('1'));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('create transaction', () => {
        it('should create a eth payment and return wallet address and id', async () => {
            const paymentDto = {
                currencyId: 1,
                amount: '12',
            };
            const payment = await service.createPayment(1, paymentDto);
            expect(payment).toBeDefined();
        });
        it('should create a token payment on ethereum network and return wallet address and id', async () => {
            const paymentDto = {
                currencyId: 1,
                amount: '12',
            };
            const payment = await service.createPayment(1, paymentDto);
            expect(payment).toBeDefined();
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
