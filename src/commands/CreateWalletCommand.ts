import { Command, CommandRunner, Option } from 'nest-commander';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet as WalletEntity } from '../database/entities/Wallet.entity';
import { Repository } from 'typeorm';
import {Wallet} from "ethers";

@Command({ name: 'create-wallet' })
export class CreateWalletCommand extends CommandRunner {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
  ) {
    super();
  }
  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    let i = 0;
    let walletCount = 1;
    console.log(passedParams)
    if(passedParams.length == 1){
      walletCount= +passedParams[0];
    }
    while(i<walletCount){
    const wallet = Wallet.createRandom();
    const createdWallet = await this.walletRepo.create({
      private_key: wallet.privateKey,
      address: wallet.address,
      wallet_network: 'etc',
      type: 'token',
    });
    const savedWallet = await this.walletRepo.save(createdWallet);
    console.log(savedWallet);
    i++;
  }
  }
}
