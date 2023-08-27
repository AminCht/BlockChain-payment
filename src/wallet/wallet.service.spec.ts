import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { Wallet } from '../database/entities/Wallet.entity';
import { Repository } from 'typeorm';
import DatabaseModule from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {PaymentService} from "../payment/payment.service";
import {Transaction} from "../database/entities/Transaction.entity";
import {User} from "../database/entities/User.entity";

describe('WalletService', () => {
  let service: WalletService;
  let walletRepo: Repository<Wallet>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Wallet,Transaction, User]),
      ],
      providers: [WalletService, PaymentService],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
