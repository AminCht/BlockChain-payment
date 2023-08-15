import { Body, Controller, Post, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('signup')
    async signUp(@Body() dto:AuthDto, @Response() res: Response){
        return await this.authService.signUp(dto, res);
    }

    @Post('login')
    async login(@Body() dto: AuthDto){
        return await this.authService.login(dto , res);
    }

}
