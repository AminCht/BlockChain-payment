import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional } from "class-validator";



export class CreateWithdrawDto{
    @ApiProperty()
    @IsNumberString()
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
export class UpdateWithdrawRequestDto{
    @ApiProperty()
    @IsNumberString()
    @IsOptional()
    amount?: string

    @ApiProperty()
    @IsOptional()
    token?: string
    
    @ApiProperty()
    @IsOptional()
    network?: string
    
    @ApiProperty()
    @IsOptional()
    dst_wallet?: string
}