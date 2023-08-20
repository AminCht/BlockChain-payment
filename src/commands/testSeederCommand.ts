import {Command, CommandRunner} from 'nest-commander';
import {InjectRepository} from '@nestjs/typeorm';
import {Wallet as WalletEntity} from '../database/entities/Wallet.entity';
import {Repository} from 'typeorm';
import {Wallet} from "ethers";
import {User} from "../database/entities/User.entity";
import {Transaction} from "../database/entities/Transaction.entity";
import * as bcrypt from "bcrypt";
import {Currency} from "../database/entities/Currency.entity";

@Command({ name: 'test-db-seeder' })
export class TestSeederCommand extends CommandRunner {
    constructor(
        @InjectRepository(WalletEntity)
        private readonly walletRepo: Repository<WalletEntity>,
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Currency)
        private readonly currencyRepo: Repository<Currency>,
    ) {
        super();
    }
    async run(): Promise<void> {
        await this.create();
    }
    private async create(){const currencyDto = {
        network: 'ethereum',
        symbol: 'eth',
        name: 'ethereum',
    };
        const currencyDto1 = {
            network: 'ethereum',
            symbol: 'USDT',
            name: 'ether',
        };
        await this.createWallet('main');
        await this.createWallet('token');
        const currency = await this.createCurrency(currencyDto);
        const currency1 = await this.createCurrency(currencyDto1);
        const user = await this.createUser([currency,currency1]);
        await this.createTransaction(user, currency);
    }
    private async createWallet(type: 'token' | 'main') {
        const wallet = Wallet.createRandom();
        const createdWallet = this.walletRepo.create({
            private_key: wallet.privateKey,
            address: wallet.address,
            wallet_network: 'ethereum',
            type: type,
        });
        return await this.walletRepo.save(createdWallet);
    }
    private async createUser(tokens: Currency[]) {
        const hashPassword = await bcrypt.hash('12345', 10);
        const user = this.userRepo.create({
            username: 'foad12',
            password: hashPassword,
            tokens: tokens,
        });
        return await this.userRepo.save(user);
    }
    private async createCurrency(dto: { network:string, symbol: string, name: string }): Promise<Currency> {
        const currency = this.currencyRepo.create(dto);
        return await this.currencyRepo.save(currency);
    }
    private async createTransaction(user: User, currency: Currency) {
        const wallet = await this.createWallet('main');
        const transaction = this.transactionRepo.create({
            wallet: wallet,
            user: user,
            amount: '12',
            currency: currency,
            wallet_balance_before: '1',
        });
        await this.transactionRepo.save(transaction);
    }
}
