import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService],
      imports: [],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
