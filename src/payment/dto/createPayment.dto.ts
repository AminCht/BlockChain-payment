import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsNotEmpty, IsNumberString } from "class-validator";

export class CreatePaymentDto{
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
