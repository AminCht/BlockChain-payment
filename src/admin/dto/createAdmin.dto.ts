import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Role } from "../../database/entities/User.entity";


export class AdminRequestDto{

    @ApiProperty()
    @IsNotEmpty()
    username: string

    @ApiProperty()
    @IsNotEmpty()
    password: string
}


export class CreateAdminResponseDto{
    @ApiProperty({ default: 'You have successfully Signed Up' })
    message: string
}

export class CreateExistUsernameResponseDto{
    @ApiProperty({ default: 'This UserName has already taken' })
    message: string

    @ApiProperty({default: 'Bad Request'})
    error: string

    @ApiProperty({default: 400})
    statusCode: number
}

export class LogingAdminResponseDto{
    @ApiProperty({ default: 'You have successfully logged in' })
    message: string
}

export class LogingWrongInfoAdminResponseDto{
    @ApiProperty({ default:'Credentials incorrect' })
    message: string

    @ApiProperty({default: 'Forbidden'})
    error: string

    @ApiProperty({default: 403})
    statusCode: number
}

export class DeleteAdminResponseDto{
    @ApiProperty({ default: 'Admin deleted' })
    message: string
}

export class DeleteNotAdminResponseDto{
    @ApiProperty({ default: 'Admin not found' })
    message: string

    @ApiProperty({default: 'Not Found'})
    error: string

    @ApiProperty({default: 404})
    statusCode: number
}

export class DeleteAdminByNotAdminResponseDto{
    @ApiProperty({ default: 'Only Admins can delete admins' })
    message: string

    @ApiProperty({default: 'Forbidden'})
    error: string

    @ApiProperty({default: 403})
    statusCode: number
}

export class GetAllUsersResponseDto{

    @ApiProperty()
    id: number

    @ApiProperty()
    username: string

    @ApiProperty()
    password: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date

    @ApiProperty()
    role: Role
}
export class GetAllUserByNotAdminResponseDto{
    @ApiProperty({default: 'Only Admins can see All users'})
    message: string
    
    @ApiProperty({default: 'Forbidden'})
    error: string

    @ApiProperty({default: 403})
    statusCode: number
}

export class UnAuthorizeResponseDto{
    @ApiProperty({default: "Unauthorized"})
    message: string

    @ApiProperty({default: 401})
    statusCode: number
}
