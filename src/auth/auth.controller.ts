import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post()
    async signUp(@Body() dto: AuthDto) {
        return await this.authService.signUp(dto);
    }

    @Post()
    async login(@Body() dto: AuthDto){
        return await this.authService.login(dto);
    }

}
