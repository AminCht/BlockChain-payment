import { IsEmail, IsNotEmpty, IsNumber, Min, MinLength } from "class-validator"

export class CreatePaymentDto{
    @IsNotEmpty()
    network: string;

    @IsNotEmpty()
    currency: string;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    amount: number;
}