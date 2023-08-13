import { ApiProperty } from "@nestjs/swagger";
import {IsDecimal, IsIn, IsNotEmpty, IsNumberString} from "class-validator";
import { ethereumTokenAddresses } from '../tokenAddresses/EthereumTokenAddresses';
export class CreatePaymentRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsIn(['ethereum'])
    network: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsIn(Array.from(ethereumTokenAddresses.keys()))
    currency: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDecimal()
    @IsNumberString()
    amount: string;

}

export class CreatePaymentResponseDto {
    @ApiProperty()
    @IsNotEmpty()
    walletAdress: string;

    @ApiProperty()
    @IsNotEmpty()
    transactionId: number;
}