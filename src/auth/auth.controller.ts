import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('signup')
    async signUp(@Body() dto:AuthDto, @Res() res:Response){
        const token = await this.authService.signUp(dto, res);
        res.send(token);
    }

    @Post('login')
    async login(@Body() dto: AuthDto, @Res() res){
        const token = await this.authService.login(dto , res);
        res.send(token);
    }

}
