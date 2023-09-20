import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { CreatePaymentRequestDto, CreatePaymentResponseDto } from './dto/createPayment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../database/entities/Wallet.entity';
import { DataSource, Repository} from 'typeorm';
import { Transaction } from '../database/entities/Transaction.entity';
import { ethers, InfuraProvider, Provider} from 'ethers';
import { User } from '../database/entities/User.entity';
import { Providers } from '../providers';

@Injectable()
export class PaymentService {
    private ethProvider: InfuraProvider;
    private bscProvider: Provider;
    private sepoliaPrivider: InfuraProvider;
    private readonly tokenABI = ['function balanceOf(address owner) view returns (uint256)'];

    constructor(
        @InjectRepository(Wallet)
        private walletRepo: Repository<Wallet>,
        @InjectRepository(Transaction)
        private transactionRepo: Repository<Transaction>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private dataSource: DataSource,
    ) {}

    public async createPayment(id: number, createPaymentDto: CreatePaymentRequestDto): Promise<CreatePaymentResponseDto | string> {
        const user = await this.userRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.tokens', 'tokens')
            .where('user.id = :id', { id: id })
            .andWhere('tokens.id = :tokenId', { tokenId: createPaymentDto.currencyId })
            .select(['user', 'tokens'])
            .getOne();
        if (!user) {
            throw new ForbiddenException(
                'You dont have access to create payment with currency: ' +
                    createPaymentDto.currencyId,
            );
        }
        const currency = user.tokens[0];
        const provider = this.selectEvmProvider(currency.network);
        if (currency.symbol == 'eth' && currency.network == 'ethereum') {
            return await this.createEthPayment(createPaymentDto, 'main', user, provider);
        } else if (currency.symbol != 'eth' && currency.network == 'ethereum') {
            return await this.createEthPayment(createPaymentDto, 'token', user, provider);
        } else if (currency.symbol == 'bnb' && currency.network == 'bsc') {
            return await this.createEthPayment(createPaymentDto,'main', user, provider)
        } else if (currency.symbol != 'bnb' && currency.network == 'bsc') {
            return await this.createEthPayment(createPaymentDto, 'token', user, provider);
        } else if (currency.symbol == 'eth' && currency.network == 'sepolia') {
            return await this.createEthPayment(createPaymentDto, 'main', user, provider);
        } else if (currency.symbol != 'eth' && currency.network == 'sepolia') {
            return await this.createEthPayment(createPaymentDto, 'token', user, provider);
        }
    }

    public selectEvmProvider(network: string): Provider {
        return Providers.selectEvmProvider(network);
    }

    private async createEthPayment(
        createPaymentDto: CreatePaymentRequestDto, type: 'main' | 'token', user: User, provider: Provider): Promise<CreatePaymentResponseDto> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const wallet = await queryRunner.query(
                'SELECT * FROM "Wallets" WHERE "lock" = false' +
                    ' AND "wallet_network" = $1 AND "type" = $2 FOR UPDATE SKIP LOCKED LIMIT 1',
                [user.tokens[0].network, type],
            );
            if (wallet.length == 1) {
                const balance = await this.getBalanceByType(type, wallet, user.tokens[0].address,provider);
                const decimals = user.tokens[0].decimals;
                const transaction = this.createEthTransaction(createPaymentDto, balance,decimals, wallet,user);
                await queryRunner.manager.save(transaction);
                await queryRunner.manager.update(
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
            throw new NotFoundException('There is no wallet available!');
        } catch (error) {
            if (error.code == 'ECONNRESET') {
                console.log('connection timeout');
                throw new InternalServerErrorException();
            } else if (error.code == 'ENOTFOUND') {
                console.log('no connection');
                throw new InternalServerErrorException();
            } else {
                await queryRunner.rollbackTransaction();
                throw error;
            }
        } finally {
            await queryRunner.release();
        }
    }

    public async getBalanceByType(type: 'main' | 'token',wallet:Wallet,currencyAddress ,provider:Provider): Promise<string>{
        let balance: string;
        if (type == 'main') {
            balance = await this.getBalance(wallet[0].address, provider);
        } else {
            balance = await this.getTokenBalance(wallet[0].address, currencyAddress, provider);
        }
        return balance;
    }
    public async getBalance(address: string, provider: Provider): Promise<string> {
        const balance = await provider.getBalance(address);
        return balance.toString();
    }
    public async getTokenBalance(address: string, currencyAddress: string, provider:Provider): Promise<string> {
        const contract = new ethers.Contract(
            currencyAddress,
            this.tokenABI,
            provider,
        );
        const balance = await contract.balanceOf(address);
        return balance.toString();
    }
    private createEthTransaction(createPaymentDto: CreatePaymentRequestDto, balance:string,decimals:number,wallet:Wallet, user: User) {
        const amount = ethers.parseUnits(createPaymentDto.amount, decimals);
        return this.transactionRepo.create({
            wallet: wallet[0],
            user: user,
            amount: amount.toString(),
            currency: user.tokens[0],
            wallet_balance_before: balance,
        });
    }

    public async getTransactionById(id: number): Promise<Transaction> {
        const transaction = await this.transactionRepo.findOneById(id);
        return transaction;
    }

    public async getWalletByAddress(address: string): Promise<Wallet> {
        const wallet = await this.walletRepo.findOne({
            where: { address: address },
        });
        return wallet;
    }
}
