import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/createPayment.dto';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Wallet }  from '../database/entities/Wallet.entity';
import { Repository , EntityManager, DataSource } from 'typeorm';
import { Transaction } from '../database/entities/Transaction.entity';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
        @InjectRepository(Wallet) private tranasctionRepo: Repository<Transaction>,
        @InjectEntityManager() private readonly entityManager: EntityManager,
        private dataSource: DataSource
    ){}

    async createPayment(createPaymnetDto: CreatePaymentDto){
        const {currency, network} = createPaymnetDto;

        if(currency == 'eth' && network == 'ethereum'){
            const queryRunner = this.dataSource.createQueryRunner();
            console.log(1)
            queryRunner.connect();
            await queryRunner.startTransaction();
            try{   
                /*const wallet = await this.walletRepo.createQueryBuilder('Wallets').
                setLock('').where('Wallets.lock=:lock', { lock: false }).getRawOne();*/
                const wallet = await queryRunner.query('SELECT * FROM Wallets WHERE "lock" = false FOR UPDATE SKIP LOCKED');
                console.log(wallet);
                if(wallet){
                    wallet.lock = true;
                    await this.walletRepo.save(wallet);
                    const transaction = this.tranasctionRepo.create({
                        wallet:{
                            id:wallet.id
                        }
                    });
                    await this.tranasctionRepo.save(transaction);
                    await queryRunner.commitTransaction();
                    return {walletAdress: wallet.address, transactionId: transaction.id};
                }
            }
            catch(error){
                await queryRunner.rollbackTransaction();
                return error;
            }finally{
                await queryRunner.release()
            }
            
        }else{

        }
    }
}
