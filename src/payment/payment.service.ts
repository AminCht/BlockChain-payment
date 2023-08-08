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
            queryRunner.connect();
            await queryRunner.startTransaction();
            try{
                const wallet = await queryRunner.manager.getRepository(Wallet).createQueryBuilder('wallet')
                .where('wallet.lock = :lock', { lock: false })
                .setLock('pessimistic_write').getOne();
                if(wallet){
                    wallet.lock = true;
                    await this.walletRepo.save(wallet);
                    const transaction = this.tranasctionRepo.create({
                        wallet:{
                            id:wallet.id
                        }
                    });
                    await this.tranasctionRepo.save(transaction);
                    return {walletAdress: wallet.address, transactionId: transaction.id};
                }
            }
            catch(error){
                await queryRunner.rollbackTransaction();
                return new ForbiddenException()
            }finally{
                await queryRunner.release()
            }
            
        }else{

        }
    }
}
