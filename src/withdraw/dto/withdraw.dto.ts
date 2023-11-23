import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional } from "class-validator";



export class CreateWithdrawDto{
    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    amount: string

    @ApiProperty()
    @IsNotEmpty()
    currencyId: number;
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
    currencyId?: number;
    
    @ApiProperty()
    @IsOptional()
    dst_wallet?: string

}

export class GetWithdrawDto{

    @ApiProperty()
    id: number;
    @ApiProperty()
    status: boolean;
    @ApiProperty()
    tx_hash: string;
    @ApiProperty()
    tx_url: string;
    @ApiProperty()
    created_at: Date;
    @ApiProperty()
    updated_at: Date;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    amount: string

    @ApiProperty()
    @IsNotEmpty()
    currencyId: number;
    @ApiProperty()
    @IsNotEmpty()
    dst_wallet: string

}