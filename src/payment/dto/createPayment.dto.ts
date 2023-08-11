import { IsDecimal, IsNotEmpty, IsNumberString } from "class-validator";

export class CreatePaymentDto{
    @IsNotEmpty()
    network: string;

    @IsNotEmpty()
    currency: string;

    @IsNotEmpty()
    @IsDecimal()
    @IsNumberString()
    amount: string;
}
