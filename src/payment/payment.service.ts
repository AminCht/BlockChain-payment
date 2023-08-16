import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentRequestDto, CreatePaymentResponseDto } from './dto/createPayment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../database/entities/Wallet.entity';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from '../database/entities/Transaction.entity';
import { ethers, InfuraProvider } from 'ethers';
import { ethereumTokenAddresses } from './tokenAddresses/EthereumTokenAddresses';
import { User } from '../database/entities/User.entity';

@Injectable()
export class PaymentService {
    private readonly provider: InfuraProvider;
    private readonly tokenABI = ['function balanceOf(address owner) view returns (uint256)'];

    constructor(
        @InjectRepository(Wallet)
        private walletRepo: Repository<Wallet>,
        @InjectRepository(Transaction)
        private transactionRepo: Repository<Transaction>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private dataSource: DataSource,
    ) {
        this.provider = new InfuraProvider(
            process.env.NETWORK,
            process.env.API_KEY,
        );
    }

    public async createPayment(id:number, createPaymentDto: CreatePaymentRequestDto): Promise<CreatePaymentResponseDto> {
        const user = await this.userRepo.findOne({
            where: {
                id: id,
            },
        });
        if (
            createPaymentDto.currency == 'eth' &&
            createPaymentDto.network == 'ethereum'
        ) {
            return await this.createEthPayment(createPaymentDto, 'main', user);
        } else if (
            createPaymentDto.currency != 'eth' &&
            createPaymentDto.network == 'ethereum'
        ) {
            return await this.createEthPayment(createPaymentDto, 'token', user);
        }
    }


    private async createEthPayment(createPaymentDto: CreatePaymentRequestDto, type: string, user: User) {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const wallet = await queryRunner.query(
                'SELECT * FROM "Wallets" WHERE "lock" = false' +
                    ' AND "wallet_network" = $1 AND "type" = $2 FOR UPDATE SKIP LOCKED LIMIT 1',
                [createPaymentDto.network, type],
            );
            if (wallet.length == 1) {
                let balance: string;
                if (type == 'main') {
                    balance = await this.getBalance(wallet[0].address);
                }
                else{
                    balance = await this.getTokenBalance(wallet[0].address, createPaymentDto.currency)
                }
                const transaction = this.createTransaction(createPaymentDto,balance,wallet,user);
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
            if(error.code == "ECONNRESET" ){
                return 'connection timeout';
            } else if (error.code == 'ENOTFOUND') {
                return 'no connection';
            } else {
                await queryRunner.rollbackTransaction();
                return error;
            }
        } finally {
            await queryRunner.release();
        }
    }

    public async getBalance(address: string): Promise<string> {
        const balance = await this.provider.getBalance(address);
        return balance.toString();
    }
    public async getTokenBalance(address: string, currency: string): Promise<string> {
        const tokenContract = new ethers.Contract(
            ethereumTokenAddresses.get(currency),
            this.tokenABI,
            this.provider,
        );
        const balance = await tokenContract.balanceOf(address);
        return balance.toString();
    }
    private createTransaction(createPaymentDto: CreatePaymentRequestDto, balance:string,wallet:Wallet, user: User) {
        return this.transactionRepo.create({
            wallet: wallet[0],
            user: user,
            amount: createPaymentDto.amount,
            currency: createPaymentDto.currency,
            network: createPaymentDto.network,
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
