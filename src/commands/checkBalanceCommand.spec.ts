import { Test, TestingModule } from '@nestjs/testing';
import {getRepositoryToken, TypeOrmModule} from "@nestjs/typeorm";
import { Wallet } from "../database/entities/Wallet.entity";
import { Transaction } from "../database/entities/Transaction.entity";
import DatabaseModule from "../database/database.module";
import { PaymentService } from '../payment/payment.service';
import { CheckBalanceCommand } from './checkBalanceCommand';
import {TransactionService} from "../transaction/transaction.service";
import {Repository} from "typeorm";
import {User} from "../database/entities/User.entity";
describe('checkBalanceCommand', () => {
    let checkBalance: CheckBalanceCommand;
    let transactionRepo: Repository<Transaction>;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                DatabaseModule,
                TypeOrmModule.forFeature([Wallet, Transaction]),
            ],
            providers: [CheckBalanceCommand],
        }).compile();
        transactionRepo = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
        checkBalance = module.get<CheckBalanceCommand>(CheckBalanceCommand);
    });

    it('should be defined', () => {
        expect(checkBalance).toBeDefined();
    });

    it('transaction wallet balance should be updated', async () => {
        jest.spyOn(checkBalance, 'getBalance').mockReturnValue(
            Promise.resolve('10'),
        );
        jest.spyOn(checkBalance, 'getTokenBalance').mockReturnValue(
            Promise.resolve('10'),
        );
        await checkBalance.run();
        const transactions = await transactionRepo.find();
        for (const transaction of transactions) {
            expect(transaction.wallet_balance_after).toBe('10');
        }
    });
});

