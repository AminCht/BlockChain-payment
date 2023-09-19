import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Currency} from '../database/entities/Currency.entity';
import {CreateCurrencyDto, GetCurrenciesResponseDto, UpdateCurrencyDto} from './dto/Currency.dto';
import {ethers, InfuraProvider, Provider} from "ethers";

@Injectable()
export class CurrencyService {
    private ethProvider: InfuraProvider;
    private bscProvider: Provider;
    private sepoliaPrivider: InfuraProvider;
    
    private readonly tokenABI = ['function decimals() view returns (uint8)'];
    constructor(@InjectRepository(Currency) private currencyRepo: Repository<Currency>) {
        this.ethProvider = new InfuraProvider(process.env.NETWORK, process.env.API_KEY);
        this.bscProvider = new ethers.JsonRpcProvider(process.env.SMARTCHAIN_NETWORK);
        this.sepoliaPrivider = new InfuraProvider(process.env.SEPOLIA_NETWORK, process.env.SEPOLIA_APIKEY);
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
            if (createCurrnecyDto.symbol != 'eth' && createCurrnecyDto.symbol != 'bnc'){
                if(createCurrnecyDto.network == 'sepolia' || 
                    createCurrnecyDto.network == 'ethereum' ||
                    createCurrnecyDto.network == 'bsc'
                ) {
                    const provider = this.selectEvmProvider(createCurrnecyDto.network);
                    decimals = Number(await this.getDecimals(createCurrnecyDto.address, provider));
                }
            }
            const createdCurrency = this.currencyRepo.create({...createCurrnecyDto ,decimals:decimals});
            const savedCurrency = await this.currencyRepo.save(createdCurrency);
            const responseDto: GetCurrenciesResponseDto = {
                id: savedCurrency.id,
                network: savedCurrency.network,
                name: savedCurrency.name,
                symbol: savedCurrency.symbol,
                status: savedCurrency.status,
                address: createCurrnecyDto.address,
            };
            return responseDto;

        } catch (error) {
            if(error.code == '23505'){
                throw new ConflictException('This network and symbol has already exist');
            }
            if(error.code == 'INVALID_ARGUMENT'){
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
            this.tokenABI,
           provider,
        );
        return await contract.decimals();
    }
    public selectEvmProvider(network: string): Provider {
        if (network == "ethereum") return this.ethProvider;
        if (network == "sepolia") return this.sepoliaPrivider;
        if (network == "bsc") return this.bscProvider;
        throw 'Invalid network';

    }
}
