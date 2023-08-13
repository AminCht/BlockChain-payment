import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "../database/entities/Wallet.entity";
import { Transaction } from "../database/entities/Transaction.entity";
import DatabaseModule from "../database/database.module";
import { PaymentService } from '../payment/payment.service';
import { CheckBallanceCommand } from './checkBalanceCommand';
describe('PaymentService', () => {
    let service: PaymentService;
    let paymentService: PaymentService;
    let checkBalance: CheckBallanceCommand;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                DatabaseModule,
                TypeOrmModule.forFeature([Wallet, Transaction]),
            ],
            providers: [PaymentService],
        }).compile();
        paymentService = module.get<PaymentService>(PaymentService);
        checkBalance = module.get<CheckBallanceCommand>(CheckBallanceCommand);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('transaction should Successful',async()=>{
        jest.spyOn(checkBalance,'getBalance').mockReturnValue(Promise.resolve('10000000000000000000000000000'));
        await checkBalance.run();
        const transaction = await paymentService.getTransactionById(transactionId);
        expect(transaction.status).toBe('Successfully');
      });

});

