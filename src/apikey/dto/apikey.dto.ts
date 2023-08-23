import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsOptional} from 'class-validator';

export class ApiKeyRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    apiList: number[];

    @ApiProperty()
    @IsOptional()
    expireDate?: Date;
}
export class ApiKeyUpdateDto {

    @ApiProperty()
    @IsOptional()
    endPointList?: number[];

    @ApiProperty()
    @IsOptional()
    expireDate?: Date;

    @ApiProperty()
    @IsOptional()
    status?: boolean;
}
