import {Injectable} from '@nestjs/common';
import {CreatePaymentDto} from './dto/createPayment.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Wallet} from '../database/entities/Wallet.entity';
import {DataSource, Repository} from 'typeorm';
import {Transaction} from '../database/entities/Transaction.entity';
import {InfuraProvider} from "ethers";

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
        console.log(1);
       // console.log(wallet);
        if (wallet[0]) {
          //await this.getWalletBalance(wallet.address);
          wallet[0].lock = true;
         // this.getWalletBalance(wallet[0].address);
          const updatedWallet = await this.walletRepo.create(wallet[0]);
          const transaction = this.transactionRepo.create({
            wallet: wallet[0],
            amount: createPaymentDto.amount,
            currency: createPaymentDto.currency,
            network: createPaymentDto.network,
            wallet_balance_before: 2000
          });
          console.log(transaction);
          console.log("before save operation");
          await queryRunner.manager.save(transaction);
          console.log("After save operation");
          await queryRunner.manager.save(updatedWallet);
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
    const pay = await provider.getBalance(address);
    console.log(pay);
  }

  infuraConnect() {
    return new InfuraProvider(
      'goerli',
      'https://mainnet.infura.io/v3/409d3a1c6c6f485cbfa0dd53901ab632',
    );
  }
}
