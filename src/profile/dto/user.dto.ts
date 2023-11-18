import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Role } from "../../database/entities/User.entity";

export class ChangePasswordDto{
    @ApiProperty()
    @IsNotEmpty()
    newPassword: string
}

export class GetProfileResponseDto{

    @ApiProperty()
    id: number

    @ApiProperty()
    userName: string

    @ApiProperty()
    role: Role

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}

export class ChangePasswordResponseDto{
    @ApiProperty({default: 'Password Has been Changed'})
    message: string
}