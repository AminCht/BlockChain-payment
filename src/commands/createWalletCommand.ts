import { Command, CommandRunner, Option } from 'nest-commander';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet as WalletEntity } from '../database/entities/Wallet.entity';
import { Repository } from 'typeorm';
import { Wallet } from "ethers";

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
        let walletCount = +passedParams[2];
        const network = passedParams[0];
        const type = passedParams[1];
        if (passedParams.length == 1) {
            walletCount = 1;
        }
        console.log(passedParams)
        await this.createWallet(network,type, walletCount);
    }
    async createWallet(network: string, type: string, walletCount: number) {
        let i = 0;
        while (i < walletCount) {
            const wallet = Wallet.createRandom();
            const createdWallet = this.walletRepo.create({
                private_key: wallet.privateKey,
                address: wallet.address,
                wallet_network: network,
                type: type,
            });
            await this.walletRepo.save(createdWallet);
            i++;
        }
    }
}
