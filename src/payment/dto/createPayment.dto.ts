import { IsEmail, IsNotEmpty, IsNumber, Min, MinLength } from "class-validator"

export class CreatePaymentDto{
    @IsNotEmpty()
    network: string;

    @IsNotEmpty()
    currency: string;

    @IsNotEmpty()
    amount: number;
}
