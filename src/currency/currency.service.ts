import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Currency} from '../database/entities/Currency.entity';
import {CreateCurrencyDto, GetCurrenciesResponseDto, UpdateCurrencyDto} from './dto/Currency.dto';
import {ethers, InfuraProvider} from "ethers";
import {ethereumTokenAddresses} from "../payment/tokenAddresses/EthereumTokenAddresses";

@Injectable()
export class CurrencyService {
    private provider: InfuraProvider;
    private readonly tokenABI = ['function decimals() view returns (uint8)'];
    constructor(@InjectRepository(Currency) private currencyRepo: Repository<Currency>) {
        this.provider = new InfuraProvider(process.env.NETWORK, process.env.API_KEY);
    }
    public async getAllCurrencies(): Promise<Currency[]> {
        return await this.currencyRepo.find();
    }
    public async getCurrencyById(id: number): Promise<Currency> {
        const currency = await this.currencyRepo.findOne({
            where: { id: id },
        });
        if (currency) {
            return currency;
        }
        throw new NotFoundException(`Currency with id ${id} not found`);
    }
    public async addCurrency(createCurrnecyDto: CreateCurrencyDto): Promise<GetCurrenciesResponseDto> {
        try {
            let decimals;
            if(createCurrnecyDto.symbol != 'eth' && createCurrnecyDto.network == 'ethereum'){
                decimals = Number(await this.getDecimals(createCurrnecyDto.symbol));
            }
            const createdCurrency = this.currencyRepo.create({ ...createCurrnecyDto ,decimals:decimals});
            const savedCurrency = await this.currencyRepo.save(createdCurrency);
            const responseDto: GetCurrenciesResponseDto = {
                id: savedCurrency.id,
                network: savedCurrency.network,
                name: savedCurrency.name,
                symbol: savedCurrency.symbol,
                status: savedCurrency.status,
              };
            return responseDto;

        } catch (error) {
            if(error.code == '23505'){
                throw new ConflictException('This network and symbol has already exist');
            }
            throw error;
        }
    }
    public async UpdateCurrency(id: number, updateCurrencyDto: UpdateCurrencyDto):Promise<UpdateCurrencyDto> {
        try {
            const update = await this.currencyRepo.update(
                { id: id },
                { ...updateCurrencyDto },
            );
            if(update.affected == 1){
                return updateCurrencyDto;
            }
            throw new NotFoundException(`Currency with id ${id} not found`);
        } catch (error) {
            if(error.code == '23505'){
                throw new ConflictException('This network and symbol has already exist');
            }
            throw error;
        }
    }
    public async DeleteCurrency(id: number) {
        const deleteResult = await this.currencyRepo.delete({ id: id });
        if(deleteResult.affected == 0){
            throw new NotFoundException(`Currency with id ${id} not found`);
        }
        return {message: `Currency with id ${id} Deleted`}
    }
    public async getDecimals(currencySymbol: string): Promise<string> {
        const contract = new ethers.Contract(
            ethereumTokenAddresses.get(currencySymbol),
            this.tokenABI,
            this.provider,
        );
        return await contract.decimals();
    }
}
