import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService],
      imports:[]
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Test create payment',()=>{
    it('should create a payment with status code 201', async () => {
      const payment = await service.createPayment('USSD', '100');
      expect(payment.body.currency).toEqual('USSD');
      expect(payment.status).toBe(201);
    })
  })
  
});
