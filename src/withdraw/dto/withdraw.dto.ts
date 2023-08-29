import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";



export class CreateWithdrawDto{
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount: string

    @ApiProperty()
    @IsNotEmpty()
    token: string
    
    @ApiProperty()
    @IsNotEmpty()
    network: string
    
    @ApiProperty()
    @IsNotEmpty()
    dst_wallet: string

}