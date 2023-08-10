import { Command, CommandRunner, Option } from 'nest-commander';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet as WalletEntity } from '../database/entities/Wallet.entity';
import { Repository } from 'typeorm';
import { Transaction } from '../database/entities/Transaction.entity';
import { InfuraProvider } from "ethers/lib.esm";

@Command({ name: 'check-balance' })
export class CheckBallanceCommand extends CommandRunner {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
  ) {
    super();
  }
  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const provider = this.infuraConnect();
    const wallet = await this.walletRepo.find({
      where: {
        lock: true,
      },
    });
    for (const walletItem of wallet) {
      await this.checkBalance(walletItem, provider);
    }
  }

  async checkBalance(walletItem: WalletEntity, provider: InfuraProvider) {
    const transaction = await this.transactionRepo.findOne({
      where: {
        wallet: {
          id: walletItem.id,
        },
      },
    });
    const currentBalance = await this.getCurrentBalance(
      transaction.wallet.address,
      provider,
    );
    const expectedAmount =
      BigInt(currentBalance) - BigInt(transaction.wallet_balance_before);
    if (expectedAmount == BigInt(transaction.amount)) {
      walletItem.lock = false;
      transaction.status = 'Successfully';
      await this.transactionRepo.save(transaction);
      await this.walletRepo.save(walletItem);
    } else if (
      expectedAmount > BigInt(transaction.amount) ||
      expectedAmount < BigInt(transaction.amount)
    ) {
      walletItem.lock = false;
      transaction.status = 'failed';
      await this.transactionRepo.save(transaction);
      await this.walletRepo.save(walletItem);
    }
  }
  infuraConnect() {
    return new InfuraProvider(process.env.DEV_NETWORK, process.env.DEV_API_KEY);
  }
  async getCurrentBalance(
    address: string,
    provider: InfuraProvider,
  ): Promise<string> {
    const balancePromise = await provider.getBalance(address);
    return balancePromise.toString();
  }
}
