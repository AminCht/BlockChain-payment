import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/createPayment.dto';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Wallet, Wallet as WalletEntity }  from '../database/entities/Wallet.entity';
import { Repository , EntityManager } from 'typeorm';
import { Transaction } from '../database/entities/Transaction.entity';

@Injectable()
export class PaymentService {
    constructor( @InjectRepository(WalletEntity) private walletRepo: Repository<WalletEntity>,
    @InjectRepository(WalletEntity) private tranasctionRepo: Repository<Transaction>,
    @InjectEntityManager() private readonly entityManager: EntityManager){}
    async createPayment(dto: CreatePaymentDto){
        const currency = dto.currency;
        const network = dto.network;
        if(currency == 'eth' && network == 'ethereum'){

            await this.entityManager.transaction(async transactionManger=>{
                const query = await this.walletRepo.createQueryBuilder().select().from(WalletEntity, 'Wallets').
                where('lock = :lock', { lock: true })
                .setLock('pessimistic_read').getOne();

                if(query){
                    query.lock= true;
                }

                await transactionManger.save(query);
                const transaction = this.tranasctionRepo.create({
                    wallet:{
                        id:query.id
                    },
                    amount:dto.amount,
                    currency:dto.currency
                });

                await this.tranasctionRepo.save(transaction);
                return transaction;
            })
        }else{

        }
    }
}
