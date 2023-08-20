import { ApiProperty } from "@nestjs/swagger";
import {IsDecimal, IsIn, IsNotEmpty, IsNumberString} from "class-validator";
import { ethereumTokenAddresses } from '../tokenAddresses/EthereumTokenAddresses';
export enum Network{
    ETHEREUM = 'ethereum'
}
export enum Currency{
    ETH = 'eth',
    USDT = 'USDT',
}
export class CreatePaymentRequestDto {
    @ApiProperty({enum:Network})
    @IsNotEmpty()
    @IsIn(['ethereum'])
    network: Network;

    @ApiProperty({enum:Currency})
    @IsNotEmpty()
    @IsIn(Array.from(ethereumTokenAddresses.keys()))
    currency: Currency;

    @ApiProperty()
    @IsNotEmpty()
    @IsDecimal()
    @IsNumberString()
    amount: string;

}

export class CreatePaymentResponseDto {
    @ApiProperty()
    @IsNotEmpty()
    walletAddress: string;

    @ApiProperty()
    @IsNotEmpty()
    transactionId: number;
}