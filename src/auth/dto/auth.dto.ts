import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class AuthDto{
    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}

export class AuthResponseDto{
    @ApiProperty()
    accessToken: string
}