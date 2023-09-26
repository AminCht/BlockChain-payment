import {ForbiddenException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {CreatePaymentRequestDto, CreatePaymentResponseDto} from './dto/createPayment.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Wallet} from '../database/entities/Wallet.entity';
import {DataSource, QueryRunner, Repository} from 'typeorm';
import {Transaction} from '../database/entities/Transaction.entity';
import {ethers, Provider} from 'ethers';
import {User} from '../database/entities/User.entity';
import {Providers} from '../providers';
import { TronWeb } from 'tronweb';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PaymentService {
    private readonly ethereumTokenABI = ['function balanceOf(address owner) view returns (uint256)'];
    private readonly tronTokenABI = [
        {
            constant: true,
            inputs: [
                {
                    name: '_owner',
                    type: 'address',
                },
            ],
            name: 'balanceOf',
            outputs: [
                {
                    name: 'balance',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
    ];

    constructor(
        @InjectRepository(Wallet)
        private walletRepo: Repository<Wallet>,
        @InjectRepository(Transaction)
        private transactionRepo: Repository<Transaction>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private dataSource: DataSource,
        private httpService: HttpService
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
        if (currency.symbol == 'eth' && currency.network == 'ethereum') {
            return await this.createEthPayment(createPaymentDto, 'main', user);
        } else if (currency.symbol != 'eth' && currency.network == 'ethereum') {
            return await this.createEthPayment(createPaymentDto, 'token', user);
        } else if (currency.symbol == 'bnb' && currency.network == 'bsc') {
            return await this.createEthPayment(createPaymentDto, 'main', user);
        } else if (currency.symbol != 'bnb' && currency.network == 'bsc') {
            return await this.createEthPayment(createPaymentDto, 'token', user);
        } else if (currency.symbol == 'eth' && currency.network == 'sepolia') {
            return await this.createEthPayment(createPaymentDto, 'main', user);
        } else if (currency.symbol != 'eth' && currency.network == 'sepolia') {
            return await this.createEthPayment(createPaymentDto, 'token', user);
        } else if (currency.symbol == 'trx' && currency.network == 'nile') {
            return await this.createTrxPayment(createPaymentDto, 'main', user);
        } else if (currency.symbol != 'trx' && currency.network == 'nile') {
            return await this.createTrxPayment(createPaymentDto, 'token', user);
        } else if (currency.symbol == 'btc' && currency.network == 'bitcoin'|| 'bitcoin test'){
            return await this.createBtcPayment(createPaymentDto, 'main', user);
        }
    }

    public selectEvmProvider(network: string): Provider {
        return Providers.selectEvmProvider(network);
    }
    public selectTvmProvider(network: string): TronWeb {
        return Providers.selectTvmProvider(network);
    }
    private async createEthPayment(
        createPaymentDto: CreatePaymentRequestDto, type: 'main' | 'token', user: User): Promise<CreatePaymentResponseDto> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const wallet = await this.findWallet(type ,user.tokens[0].network,queryRunner);
            if (wallet.length == 1) {
                const provider = this.selectEvmProvider(user.tokens[0].network);
                const balance = await this.getEthBalanceByType(type, wallet, user.tokens[0].address,provider);
                const transaction = this.createEthTransaction(createPaymentDto.amount, balance,wallet,user);
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
    private async createTrxPayment(createPaymentDto: CreatePaymentRequestDto, type: 'main' | 'token', user: User) {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const wallet = await this.findWallet(type ,user.tokens[0].network,queryRunner);
            if (wallet.length == 1) {
                const provider = this.selectTvmProvider(user.tokens[0].network);
                const balance = await this.getTrxBalanceByType(type, wallet, user.tokens[0].address,provider);
                const transaction = this.createTrxTransaction(createPaymentDto.amount, balance,wallet,user);
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

    private async createBtcPayment(createPaymentDto: CreatePaymentRequestDto, type: 'main' | 'token', user: User) {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const wallet = await this.findWallet(type ,user.tokens[0].network,queryRunner);
            if (wallet.length == 1) {
                const balance = await this.getBitcoinBalance(wallet);
                const transaction = await this.createBtcTransaction(createPaymentDto.amount, balance,wallet,user);
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


    public async getEthBalanceByType(type: 'main' | 'token', wallet:Wallet, currencyAddress , provider:Provider): Promise<string>{
        let balance: string;
        if (type == 'main') {
            balance = await this.getEthBalance(wallet[0].address, provider);
        } else {
            balance = await this.getEthTokenBalance(wallet[0].address, currencyAddress, provider);
        }
        return balance;
    }
    public async getTrxBalanceByType(type: 'main' | 'token', wallet:Wallet, currencyAddress , provider:Provider): Promise<string>{
        let balance: string;
        if (type == 'main') {
            balance = await this.getTrxBalance(wallet[0].address, provider);
        } else {
            balance = await this.getTrxTokenBalance(wallet[0].address, currencyAddress, provider);
        }
        return balance;
    }
    public async getEthBalance(address: string, provider: Provider): Promise<string> {
        const balance = await provider.getBalance(address);
        return balance.toString();
    }
    public async getEthTokenBalance(address: string, currencyAddress: string, provider:Provider): Promise<string> {
        const contract = new ethers.Contract(
            currencyAddress,
            this.ethereumTokenABI,
            provider,
        );
        const balance = await contract.balanceOf(address);
        return balance.toString();
    }
    private createEthTransaction(amount: string, balance:string,wallet:Wallet, user: User) {
        const weiAmount = ethers.parseUnits(amount, user.tokens[0].decimals);
        return this.transactionRepo.create({
            wallet: wallet[0],
            user: user,
            amount: weiAmount.toString(),
            currency: user.tokens[0],
            wallet_balance_before: balance,
        });
    }
    private async findWallet(type: 'main' | 'token', network: string,queryRunner:QueryRunner) {
        return await queryRunner.query(
            'SELECT * FROM "Wallets" WHERE "lock" = false' +
            ' AND "wallet_network" = $1 AND "type" = $2 FOR UPDATE SKIP LOCKED LIMIT 1',
            [network, type],
        );
    }

    public async getTransactionById(id: number): Promise<Transaction> {
        const transaction = await this.transactionRepo.findOneById(id);
        return transaction;
    }
    private async getTrxBalance(address, provider: TronWeb) {
        try {
            const balance = await provider.trx.getBalance(address);
            return balance.toString();
        } catch (error) {
            throw new Error(`Error fetching balance: ${error.message}`);
        }
    }

    private async getTrxTokenBalance(address, currencyAddress, provider: TronWeb) {
        try {
            provider.setAddress(currencyAddress);
            const contract = await provider.contract(this.tronTokenABI).at(currencyAddress);
            const balance = await contract.balanceOf(address).call();
            return balance.toString();
        } catch (error) {
            throw new Error(`Error fetching token balance: ${error.message}`);
        }
    }

    private createTrxTransaction(amount:string, balance: string,wallet: Wallet, user: User) {
        const sunValue = BigInt(amount) * BigInt(Math.pow(10, user.tokens[0].decimals));
        return this.transactionRepo.create({
            wallet: wallet[0],
            user: user,
            amount:String(sunValue),
            currency: user.tokens[0],
            wallet_balance_before: balance,
        });
    }
    public async getWalletByAddress(address: string): Promise<Wallet> {
        const wallet = await this.walletRepo.findOne({
            where: { address: address },
        });
        return wallet;
    }
    public async getBitcoinBalance(wallet: Wallet){
        if(wallet[0].wallet_network =='bitcoin'){
            const response = await this.httpService.get(`${process.env.BITCOINMAINBALANCEAPI}${wallet[0].address}`).toPromise();
            return response.data['balance'];
        }
        const response = await this.httpService.get(`${process.env.BITCOINTESTBALANCEAPI}${wallet[0].address}`).toPromise();
        return response.data['balance']; 
    }

    private async createBtcTransaction(amount: string, balance:string, wallet:Wallet, user: User): Promise<Transaction>{
        const satoshi =  Number(amount) * Math.pow(10, user.tokens[0].decimals);
        return this.transactionRepo.create({
            wallet: wallet[0],
            user: user,
            amount:String(satoshi),
            currency: user.tokens[0],
            wallet_balance_before: balance,
        });
    }
}
