import { Command, CommandRunner, Option } from 'nest-commander';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet as WalletEntity } from '../database/entities/Wallet.entity';
import { Repository } from 'typeorm';
import { Transaction } from '../database/entities/Transaction.entity';

@Command({ name: 'check-balance' })
export class CheckBallanceCommand extends CommandRunner {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(WalletEntity) private readonly walletRepo: Repository<WalletEntity> 
  ) {
    super();
  }
  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const wallet = await this.walletRepo.find({
        where:{
            lock:false
        }
    });
    for(var walletItem of wallet){
        await this.checkBalance(walletItem);
    }
  }

  async checkBalance(walletItem: WalletEntity){
    const transaction = await this.transactionRepo.findOne({
        where:{
            wallet:{
                id:walletItem.id
            }
        }
    });
    const amount = transaction.wallet_balance_after - transaction.wallet_balance_before;
    if(transaction.amount=amount){
        walletItem.lock = false;
        await this.transactionRepo.save(walletItem);
    }
  }
}