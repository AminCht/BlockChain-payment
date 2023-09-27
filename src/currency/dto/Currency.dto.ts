import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsOptional} from 'class-validator';
import { Currency } from '../../database/entities/Currency.entity';
export class CreateCurrencyDto {

    @ApiProperty()
    @IsNotEmpty()
    network: string;

    @ApiProperty()
    @IsNotEmpty()
    name: string;
    @ApiProperty()
    @IsNotEmpty()
    symbol: string;

    @ApiProperty()
    @IsNotEmpty()
    decimals: number;

    @ApiProperty()
    @IsOptional()
    status?: boolean;
    @ApiProperty()
    @IsOptional()
    CoinGeckoId?: string;
}
export class CreateTokenDto {

    @ApiProperty()
    @IsNotEmpty()
    network: string;

    @ApiProperty()
    @IsNotEmpty()
    name: string;
    @ApiProperty()
    @IsNotEmpty()
    symbol: string;

    @ApiProperty()
    @IsOptional()
    status?: boolean;
    @ApiProperty()
    @IsNotEmpty()
    address: string;
    @ApiProperty()
    @IsOptional()
    CoinGeckoId?: string;
}
export class UpdateCurrencyDto {
    @ApiProperty()
    @IsOptional()
    network?: string;

    @ApiProperty()
    @IsOptional()
    name?: string;
    @ApiProperty()
    @IsOptional()
    symbol?: string;

    @ApiProperty()
    @IsOptional()
    status?: boolean;
    @ApiProperty()
    @IsOptional()
    address?: string;
    @ApiProperty()
    @IsNotEmpty()
    CoinGeckoId?: string;
}

export class GetCurrenciesResponseDto{
    constructor(currency: Currency){}
    static currencyToDto(currency: Currency): GetCurrenciesResponseDto{
        return new GetCurrenciesResponseDto(currency);
    }
    @ApiProperty()
    id: number;

    @ApiProperty()
    network: string;

    @ApiProperty()
    name: string;
    @ApiProperty()
    symbol: string;

    @ApiProperty()
    status: boolean;
    @ApiProperty()
    address: string;
    @ApiProperty()
    CoinGeckoId?: string;

    @ApiProperty()
    decimals: number;
}

export class UnAuthorizeResponseDto{
    @ApiProperty({default: "Unauthorized"})
    message: string

    @ApiProperty({default: 401})
    statusCode: number
}
export class CurrencyNotFoundResponseDto{
    @ApiProperty({ default: 'Currency with id "x" not found' })
    message: string

    @ApiProperty({default: 'Not Found'})
    error: string

    @ApiProperty({default: 404})
    statusCode: number
}