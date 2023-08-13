import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsNotEmpty, IsNumberString } from "class-validator";

export class CreatePaymentRequestDto{
    @ApiProperty()
    @IsNotEmpty()
    network: string;

    @ApiProperty()
    @IsNotEmpty()
    currency: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDecimal()
    @IsNumberString()
    amount: string;

}

export class CreatePaymentResponseDto{
    @ApiProperty()
    @IsNotEmpty()
    walletAdress: string;

    @ApiProperty()
    @IsNotEmpty()
    transactionId: number;
}