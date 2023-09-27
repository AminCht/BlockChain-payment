import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Currency} from '../database/entities/Currency.entity';
import {CreateCurrencyDto, CreateTokenDto, GetCurrenciesResponseDto, UpdateCurrencyDto} from './dto/Currency.dto';
import {ethers,Provider} from "ethers";
import { HttpService } from '@nestjs/axios';
import {Providers} from "../providers";

@Injectable()
export class CurrencyService {
    private readonly ethereumTokenABI = ['function decimals() view returns (uint8)'];
    private readonly tronTokenABI = [
        {
            constant: true,
            inputs: [],
            name: 'decimals',
            outputs: [
                {
                    name: '',
                    type: 'uint8',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
    ];
    constructor(@InjectRepository(Currency) private currencyRepo: Repository<Currency>,private readonly httpService: HttpService) {}
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
            const createdCurrency = this.currencyRepo.create({...createCurrnecyDto});
            const savedCurrency = await this.currencyRepo.save(createdCurrency);
            const responseDto: GetCurrenciesResponseDto = {
                id: savedCurrency.id,
                network: savedCurrency.network,
                name: savedCurrency.name,
                symbol: savedCurrency.symbol,
                status: savedCurrency.status,
                address: '',
                decimals: savedCurrency.decimals,
            };
            return responseDto;

        } catch (error) {
            if(error.code == '23505'){
                throw new ConflictException('This network and symbol has already exist');
            }
            throw error;
        }
    }
    public async addTokenCurrency(createTokenDto: CreateTokenDto): Promise<GetCurrenciesResponseDto> {
        try {
            let decimals;
            if (createTokenDto.symbol != 'eth' && createTokenDto.symbol != 'bnc' && createTokenDto.symbol!= 'trx'){
                if(createTokenDto.network == 'sepolia' ||
                    createTokenDto.network == 'ethereum' ||
                    createTokenDto.network == 'bsc'
                ) {
                    try {
                        const provider = this.selectEvmProvider(createTokenDto.network);
                        decimals = Number(
                            await this.getDecimals(createTokenDto.address, provider),
                        );
                    } catch (error) {
                        throw new Error(`Error fetching token decimals: ${error.message}`);
                    }
                } else if (createTokenDto.network == 'nile' || createTokenDto.network == 'tron' ) {
                    try {
                        const provider = this.selectTvmProvider(createTokenDto.network);
                        provider.setAddress(createTokenDto.address);
                        const contract = await provider.contract(this.tronTokenABI,createTokenDto.address);
                        decimals = await contract.decimals().call();
                    } catch (error) {
                        throw new Error(`Error fetching token decimals: ${error.message}`);
                    }
                } else {
                    throw new Error('unsupported network');
                }
            } else {
                throw new Error('unsupported token');
            }
            const createdCurrency = this.currencyRepo.create({...createTokenDto ,decimals:decimals});
            const savedCurrency = await this.currencyRepo.save(createdCurrency);
            const responseDto: GetCurrenciesResponseDto = {
                id: savedCurrency.id,
                network: savedCurrency.network,
                name: savedCurrency.name,
                symbol: savedCurrency.symbol,
                status: savedCurrency.status,
                address: savedCurrency.address,
                decimals: savedCurrency.decimals,
            };
            return responseDto;

        } catch (error) {
            console.log(error);
            if(error.code == '23505'){
                throw new ConflictException('This network and symbol has already exist');
            }
            if(error.code == 'INVALID_ARGUMENT' ||error.code =='UNSUPPORTED_OPERATION'){
                throw new BadRequestException('you must set a valid address for tokens');
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
    public async getDecimals(currencyAddress: string,provider: Provider): Promise<string> {
        const contract = new ethers.Contract(
            currencyAddress,
            this.ethereumTokenABI,
           provider,
        );
        return await contract.decimals();
    }
    public selectEvmProvider(network: string): Provider {
        return Providers.selectEvmProvider(network);
    }

    public async getPrice(){
        const coins = await this.getUserCurrencies();
        const queryStringValues = this.setqueryStringValues(coins);
        const response = await this.httpService.get(process.env.COINGECKOID_URL + '/simple/price',{params:queryStringValues}).toPromise();
        const data = coins.map((coin) => {
            return {
                ...coin,
                usd: response.data[coin.CoinGeckoId].usd,
            };
        });
        return data
    }

    private setqueryStringValues(coins: Currency[]) {
        const coinsToSend = [];
        for(const coinId of coins){
            coinsToSend.push(coinId.CoinGeckoId);
        }
        const vs_currencies = 'usd';
        return { ids: coinsToSend.join(','), vs_currencies: vs_currencies}
    }

    public async getUserCurrencies() {
        return await this.currencyRepo.createQueryBuilder('currencies')
        .select(['currencies.CoinGeckoId','currencies.symbol'])
        .distinctOn(['currencies.CoinGeckoId','currencies.symbol'])
        .getMany()
    }

    private selectTvmProvider(network: string) {
        return Providers.selectTvmProvider(network);
    }
}
