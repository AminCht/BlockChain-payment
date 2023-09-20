import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PaymentService } from '../src/payment/payment.service';
import { CheckBalanceCommand } from '../src/commands/checkBalanceCommand';
import { Transaction } from '../src/database/entities/Transaction.entity';
import DatabaseModule from '../src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../src/database/entities/Wallet.entity';
import { Repository } from 'typeorm';
import { CreateWalletCommand } from '../src/commands/createWalletCommand';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let paymentService: PaymentService;
  let checkBalance: CheckBalanceCommand;
  let createWallet: CreateWalletCommand;
  let transactionRepo: Repository<Transaction>;
  let transactionId: number;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule,DatabaseModule,
        TypeOrmModule.forFeature([Wallet, Transaction]),],
        providers:[PaymentService,CheckBalanceCommand,CreateWalletCommand]
    }).compile();

    app = moduleFixture.createNestApplication();
    paymentService = moduleFixture.get<PaymentService>(PaymentService);
    checkBalance = moduleFixture.get<CheckBalanceCommand>(CheckBalanceCommand);
    createWallet = moduleFixture.get<CreateWalletCommand>(CreateWalletCommand);
    await app.init();
  });

  it('create wallet',async()=>{
    await createWallet.run(['1']);
    expect(createWallet).toBeDefined();
  }) 
 
  it('should create transaction', async() => {
    jest.spyOn(paymentService, 'getEthBalance').mockReturnValue(Promise.resolve('3'));
    const paymentDto = {
      network: 'ethereum',
      currency: 'eth',
      amount: "4",
    };
    const payment = await paymentService.createPayment(paymentDto);
    transactionId = payment.transactionId;
    expect(payment).toEqual({
      walletAddress: payment.walletAddress,
      transactionId: payment.transactionId,
    });
  });
  it('transaction should stay pending',async()=>{
    jest.spyOn(checkBalance,'getBalance').mockReturnValue(Promise.resolve('10000'));
    await checkBalance.run();
    const transaction = await paymentService.getTransactionById(transactionId);
    expect(transaction.status).toBe('Pending');
  });
  it('transaction should Successful',async()=>{
    jest.spyOn(checkBalance,'getBalance').mockReturnValue(Promise.resolve('10000000000000000000000000000'));
    await checkBalance.run();
    const transaction = await paymentService.getTransactionById(transactionId);
    expect(transaction.status).toBe('Successfully');
  });
});
