import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreatePaymentRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    currencyId: number;
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
export class UnAuthorizeResponseDto{
    @ApiProperty({default: "Transaction with id 'x' not found"})
    message: string

    @ApiProperty({default: 404})
    statusCode: number
}

export class BadRequestResponseDto{
    @ApiProperty()
    message: Array<string>
    @ApiProperty({default: 'Bad Request'})
    error: string
    @ApiProperty({default: 400})
    statusCode: number
}