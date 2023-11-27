import { Command, CommandRunner, Option } from 'nest-commander';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs-extra';
import { Currency } from '../database/entities/Currency.entity';

@Command({ name: 'add-currency' })
export class AddCurrencyCommand extends CommandRunner {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
  ) {
        super();
    }
    async run(
        passedParams: string[],
        options?: Record<string, any>,
    ): Promise<void> {
        const currencies = await this.getDataFromJson();
        await this.addCurrency(currencies);
    }

    async getDataFromJson(){
        return await fs.readJson('src/currency/currency.json');
    }

    async addCurrency(accesses){
        for(const item of accesses){
            const currency = await this.currencyRepo.findOne({
                where:{
                    network: item.network,
                    name: item.accessName
                }
            });
            if(!currency){
                const currency =this.currencyRepo.create({
                    network: item.network,
                    name: item.name,
                    symbol: item.symbol,
                    CoinGeckoId: item.CoinGeckoId,
                    status: item.status,
                    address: item.address,
                    decimals: item.decimals,
                });
                await this.currencyRepo.save(currency);
            }
        }
    }
    
}
