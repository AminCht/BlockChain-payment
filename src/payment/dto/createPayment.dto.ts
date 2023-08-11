import { IsDecimal, IsNotEmpty } from "class-validator";

export class CreatePaymentDto{
    @IsNotEmpty()
    network: string;

    @IsNotEmpty()
    currency: string;

    @IsNotEmpty()
    @IsDecimal()
    amount: string;
}
