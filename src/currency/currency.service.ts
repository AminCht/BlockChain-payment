import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, UpdateResult} from 'typeorm';
import { Currency } from '../database/entities/Currency.entity';
import { CurrencyDto, UpdateCurrencyDto} from './dto/Currency.dto';

@Injectable()
export class CurrencyService {
    constructor(@InjectRepository(Currency) private currencyRepo: Repository<Currency>) {}
    public async getAllCurrencies(): Promise<Currency[]> {
        return await this.currencyRepo.find();
    }
    public async getCurrencyById(id: number): Promise<Currency> {
        return await this.currencyRepo.findOne({
            where: { id: id },
        });
    }
    public async addCurrency(createCurrnecyDto: CurrencyDto): Promise<Currency> {
        try {
            const createdCurrency = this.currencyRepo.create(createCurrnecyDto);
            const savedCurrency = await this.currencyRepo.save(createdCurrency);
            return savedCurrency;
        } catch (error) {
            console.log(error);
        }
    }
    public async UpdateCurrency(id: number, updateCurrencyDto: UpdateCurrencyDto):Promise<UpdateResult> {
        try {
            const updatedCurrency = await this.currencyRepo.update(
                { id: id },
                { ...updateCurrencyDto },
            );
            return updatedCurrency;
        } catch (error) {
            console.log(error);
        }
    }
    public async DeleteCurrency(id: number) {
        return await this.currencyRepo.delete({ id: id });
    }
}
