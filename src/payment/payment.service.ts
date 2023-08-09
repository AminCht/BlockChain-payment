import {Injectable} from '@nestjs/common';
import {CreatePaymentDto} from './dto/createPayment.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Wallet} from '../database/entities/Wallet.entity';
import {DataSource, Repository} from 'typeorm';
import {Transaction} from '../database/entities/Transaction.entity';
import {InfuraProvider} from "ethers";
import { checkDatabase } from 'typeorm-extension';

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
          'SELECT * FROM "Wallets" WHERE "lock" = false FOR UPDATE SKIP LOCKED LIMIT 1',
        );
        if (wallet[0]) {
          const balance = this.getWalletBalance(wallet[0].address);
          console.log('balance:'+balance);
          const transaction = this.transactionRepo.create({
            wallet: wallet[0],
            amount: createPaymentDto.amount,
            currency: createPaymentDto.currency,
            network: createPaymentDto.network,
            wallet_balance_before: balance.toString(),
          });
          //await queryRunner.manager.save(updatedWallet);
          console.log(transaction);
          await queryRunner.manager.save(transaction);
          const updatedWallet = await queryRunner.manager.update(
            Wallet,
            { id: wallet[0].id },
            { lock: true },
          );
          await queryRunner.commitTransaction();
          return {
            walletAddress: wallet[0].address,
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
  async getWalletBalance(address: string) {
    const provider = this.infuraConnect();
    const promiseObject = await provider.getBalance(address); // Replace with your actual Promise
    return await this.processBigIntPromise(promiseObject);
  }

  async processBigIntPromise(promise) {
    const bigIntValue = await promise;
    return bigIntValue; // This will log the resolved bigint value
    // Perform any other operations with the resolved bigint value
  }
  
  

  infuraConnect() {
    return new InfuraProvider(
      'goerli',
      'https://mainnet.infura.io/v3/409d3a1c6c6f485cbfa0dd53901ab632',
    );
  }
}
