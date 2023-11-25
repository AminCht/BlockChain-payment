import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsOptional} from 'class-validator';

export class BalanceRequestDto {
  @ApiProperty()
  @IsNotEmpty()
    currencyId: number;

  @ApiProperty()
  @IsOptional()
  currencyName: string;

  @ApiProperty()
  @IsOptional()
  amount: number;

}