import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { User } from "../../database/entities/User.entity";


export class CreateTicketRequestDto{
    @ApiProperty()
    @IsNotEmpty()
    subject: string
}

export class CreateTicketResponseDto{
    @ApiProperty()
    subject: string

    @ApiProperty()
    user: User

    @ApiProperty()
    id: number

    @ApiProperty()
    status: number
}

export class GetTicketResponseDto{
    @ApiProperty()
    id: number

    @ApiProperty()
    subject: string

    @ApiProperty()
    status: number
}