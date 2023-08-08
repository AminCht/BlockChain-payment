import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/createPayment.dto';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Wallet } from '../database/entities/Wallet.entity';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { Transaction } from '../database/entities/Transaction.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    if (
      createPaymentDto.currency == 'eth' &&
      createPaymentDto.network == 'ethereum'
    ) {
      const queryRunner = this.dataSource.createQueryRunner();
      try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        /*const wallet = await this.walletRepo.createQueryBuilder('Wallets').
            setLock('').where('Wallets.lock=:lock', { lock: false }).getRawOne();*/
        const wallet = await queryRunner.query(
          'SELECT * FROM Wallets WHERE "lock" = false FOR UPDATE SKIP LOCKED',
        );
        console.log(wallet);
        if (wallet) {
          wallet.lock = true;
          await this.walletRepo.save(wallet);
          const transaction = this.transactionRepo.create({
            wallet: {
              id: wallet.id,
            },
            amount: createPaymentDto.amount,
            currency: createPaymentDto.currency,
            network: createPaymentDto.network,
          });
          await this.transactionRepo.save(transaction);
          await queryRunner.commitTransaction();
          return {
            walletAddress: wallet.address,
            transactionId: transaction.id,
          };
        }
      } catch (error) {
        await queryRunner.rollbackTransaction();
        return error;
      } finally {
        await queryRunner.release();
      }
    } else {
    }
  }
}
