import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import DatabaseModule from '../database/database.module';
import { Wallet } from '../database/entities/Wallet.entity';
import { Transaction } from '../database/entities/Transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('TransactionService', () => {
  let service: TransactionService;
  
  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Transaction]),
      ],
      providers: [TransactionService],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
