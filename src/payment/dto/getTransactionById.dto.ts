import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GetTransactionByIdResponseDto{

    @ApiProperty()
    @IsNotEmpty()
    transactionId: number;

    @ApiProperty()
    @IsNotEmpty()
    Network: string;
    
    @ApiProperty()
    @IsNotEmpty()
    amount: string;

    @ApiProperty()
    @IsNotEmpty()
    currency: string;

    @ApiProperty()
    @IsNotEmpty()
    status: string;

    @ApiProperty()
    @IsNotEmpty()
    wallet_balance_before: string;

    @ApiProperty()
    @IsNotEmpty()
    wallet_balance_after: string;

    @ApiProperty()
    @IsNotEmpty()
    createdDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    expireTime: Date;
}
export class TransactionNotFoundResponseDto{
    @ApiProperty({default: "Transaction with id 'x' not found"})
    message: string

    @ApiProperty({default: 404})
    statusCode: number
}