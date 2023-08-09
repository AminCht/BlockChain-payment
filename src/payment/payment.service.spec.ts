import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "../database/entities/Wallet.entity";
import { Transaction } from "../database/entities/Transaction.entity";
import { Repository } from "typeorm";
import DatabaseModule from "../database/database.module";
import * as process from "process";
describe('PaymentService', () => {
  let service: PaymentService;
  let walletRepo: Repository<Wallet>;
  //let transactionRepo: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Wallet, Transaction]),
      ],
      providers: [PaymentService],
    }).compile();
    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    //expect(walletRepo).toBeDefined();
   // expect(transactionRepo).toBeDefined();
  });
  describe('Test create payment', () => {
    it('should create a payment and return wallet address and id', async () => {
      const paymentDto = {
        network: 'ethereum',
        currency: 'eth',
        amount: 100,
      };
      const payment = await service.createPayment(paymentDto);
      expect(payment.body).toEqual({
        walletAddress: 1,
        transactionId: 1,
      });
    });
  });
});
