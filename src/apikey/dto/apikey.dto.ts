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
export class UnAuthorizedResponseDto{
    @ApiProperty({default: 'Unauthorized'})
    message: string

    @ApiProperty({default: 401})
    statusCode: number
}

export class ApiKeyResponseDto{
    @ApiProperty()
    id: number

    @ApiProperty()
    key: string

    @ApiProperty()
    status: boolean

    @ApiProperty()
    expireTime: Date

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}

export class GetAccessResponseDto{
    @ApiProperty()
    id: number

    @ApiProperty()
    name: string
}
