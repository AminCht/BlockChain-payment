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
            lock:true
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
    const amount = BigInt(transaction.wallet_balance_after) - BigInt(transaction.wallet_balance_before );
    if(BigInt(transaction.amount)==amount){
        walletItem.lock = false;
        transaction.status = 'Successfully';
        await this.transactionRepo.save(transaction);
        await this.walletRepo.save(walletItem);
    }
  }
}