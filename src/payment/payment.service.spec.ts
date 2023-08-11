import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "../database/entities/Wallet.entity";
import { Transaction } from "../database/entities/Transaction.entity";
import DatabaseModule from "../database/database.module";
describe('PaymentService', () => {
    let service: PaymentService;
    let getWalletBalanceMock: jest.SpyInstance<Promise<string>>
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                DatabaseModule,
                TypeOrmModule.forFeature([Wallet, Transaction]),
            ],
            providers: [PaymentService],
        }).compile();
        service = module.get<PaymentService>(PaymentService);
        jest
        .spyOn(service, 'getWalletBalance')
        .mockReturnValue(Promise.resolve('1'));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a payment and return wallet address and id', async () => {
        const paymentDto = {
            network: 'ethereum',
            currency: 'eth',
            amount: "12",
        };
        const payment = await service.createPayment(paymentDto);
        expect(payment).toEqual({
            walletAddress: payment.walletAddress,
            transactionId: payment.transactionId,
        });
    });

});

