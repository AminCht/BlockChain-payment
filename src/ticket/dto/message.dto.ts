import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class SendMessageRequestDto{

    @ApiProperty()
    @IsNotEmpty()
    text:string

}