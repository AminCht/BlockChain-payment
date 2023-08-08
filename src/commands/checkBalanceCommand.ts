import { Command, CommandRunner, Option } from 'nest-commander';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet as WalletEntity } from '../database/entities/Wallet.entity';
import { Repository } from 'typeorm';
import { Transaction } from '../database/entities/Transaction.entity';

@Command({ name: 'check-balance' })
export class CreateWalletCommand extends CommandRunner {
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
    console.log(wallet);
  }
  checkBalance(item: WalletEntity){
    
  }
}