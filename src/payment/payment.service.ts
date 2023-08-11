import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/createPayment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Wallet } from "../database/entities/Wallet.entity";
import { DataSource, Repository } from "typeorm";
import { Transaction } from "../database/entities/Transaction.entity";
import { InfuraProvider } from "ethers";

@Injectable()
export class PaymentService {
    public provider: InfuraProvider;
    constructor(
        @InjectRepository(Wallet)
        private walletRepo: Repository<Wallet>,
        @InjectRepository(Transaction)
        private transactionRepo: Repository<Transaction>,
        private dataSource: DataSource,
    ) {
       this.provider = new InfuraProvider(process.env.NETWORK, process.env.API_KEY);
    }

    public async createPayment(createPaymentDto: CreatePaymentDto) {
        if (
            createPaymentDto.currency == 'eth' &&
            createPaymentDto.network == 'ethereum'
        ) {
            return await this.createEthPayment(createPaymentDto);
        } else {

        }
    }

    public async getWalletBalance(address: string): Promise<string> {
        const balancePromise = await this.provider.getBalance(address);
        return balancePromise.toString();
    }

    private async createEthPayment(createPaymentDto: CreatePaymentDto){

        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            // TODO: not enugh
            const wallet = await queryRunner
              .query('SELECT * FROM "Wallets" WHERE "lock" = false AND' +
                ' "wallet_network" = $1 FOR UPDATE SKIP LOCKED LIMIT 1', ['ethereum']);
            if (wallet.length == 1) {
                const balance = await this.getWalletBalance(wallet[0].address);
                const transaction = this.transactionRepo.create({
                    wallet: wallet[0],
                    amount: createPaymentDto.amount,
                    currency: createPaymentDto.currency,
                    network: createPaymentDto.network,
                    wallet_balance_before: balance,
                });
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
            throw new NotFoundException("There is no wallet available!");
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return error;
        } finally {
            await queryRunner.release();
        }
    }

    public async getTransactionById(id: number): Promise<Transaction> {
        const transaction = await this.transactionRepo.findOneById(id);
        return transaction;
    }

    public async getWalletByAddress(address: string): Promise<Wallet> {
        const wallet = await this.walletRepo.findOne({where: {address: address}});
        return wallet;
    }

}
