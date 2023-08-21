import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsOptional} from 'class-validator';

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
    @IsOptional()
    status?: boolean;
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
}

export class GetAllCurrenciesResponseDto{
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
    status: boolean;
}