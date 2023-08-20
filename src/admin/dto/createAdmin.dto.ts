import { IsNotEmpty } from "class-validator";


export class AdminRequestDto{

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string
}