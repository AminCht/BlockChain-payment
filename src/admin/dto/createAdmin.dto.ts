import { IsNotEmpty } from "class-validator";


export class CreateAdminRequestDto{

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string
}