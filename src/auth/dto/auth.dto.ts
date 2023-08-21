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
export class CreateUserWithExistUsernameResponseDto{
    @ApiProperty({default: 'This UserName has already taken'})
    message: string
    
    @ApiProperty({default: 'Bad Request'})
    error: string

    @ApiProperty({default: 400})
    statusCode: number
}

export class CreateUserResponseDto{
    @ApiProperty({ default: 'You have been registered successfully' })
    message: string
}

export class UnAuthorizeResponseDto{
    @ApiProperty({default: "Credentials incorrect"})
    message: string

    @ApiProperty({default: 'Unauthorized'})
    error: string
    
    @ApiProperty({default: 401})
    statusCode: number

}

export class LoginUserResponseDto{
    @ApiProperty({ default: 'You have successfully logged in' })
    message: string
}

