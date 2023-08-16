import {Command, CommandRunner} from 'nest-commander';
import {InjectRepository} from '@nestjs/typeorm';
import {Wallet as WalletEntity} from '../database/entities/Wallet.entity';
import {Repository} from 'typeorm';
import {Wallet} from "ethers";
import {User} from "../database/entities/User.entity";
import {Transaction} from "../database/entities/Transaction.entity";

@Command({ name: 'test-db-seeder' })
export class TestDbSeeder extends CommandRunner {
    constructor(
        @InjectRepository(WalletEntity)
        private readonly walletRepo: Repository<WalletEntity>,
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {
        super();
    }
    async run(
        passedParams: string[],
        options?: Record<string, any>,
    ): Promise<void> {
        const wallet = await this.createWallet('main');
        await this.createWallet('token');
        const user = await this.createUser();
        await this.createTransaction(wallet, user);
    }
    async createWallet(type: 'token' | 'main') {
        const wallet = Wallet.createRandom();
        const createdWallet = this.walletRepo.create({
            private_key: wallet.privateKey,
            address: wallet.address,
            wallet_network: 'ethereum',
            type: type,
        });
        return await this.walletRepo.save(createdWallet);
    }
    async createUser() {
        const user = this.userRepo.create({
            username: 'foad12',
            password: 'password',
        });
        return await this.userRepo.save(user);
    }
    async createTransaction(wallet: WalletEntity, user: User) {
        const transaction = this.transactionRepo.create({
            wallet: wallet,
            user: user,
            amount: '12',
            currency: 'eth',
            network: 'ethereum',
            wallet_balance_before: '1',
        });
    }
}
