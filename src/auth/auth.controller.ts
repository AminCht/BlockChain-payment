import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthResponseDto } from './dto/auth.dto';
import { Response } from 'express';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}


    @ApiOperation({ summary: 'User Registeration' })
    @ApiResponse({ status: 403, description: 'This UserName has already taken' })
    @ApiResponse({ status: 201, description: 'user signup and get accessToken',type: AuthResponseDto})
    @Post('signup')
    async signUp(@Body() dto:AuthDto, @Res() res:Response): Promise<void>{
        const token = await this.authService.signUp(dto);
        res.status(201);
        res.send(token);
    }

    @ApiOperation({ summary: 'Login User' })
    @ApiResponse({ status: 403, description: 'unAuthorized' })
    @ApiResponse({ status: 200, description: 'user signup and get accessToken',type: AuthResponseDto})
    @Post('login')
    async login(@Body() dto: AuthDto, @Res() res: Response): Promise<void>{
        const token = await this.authService.login(dto);
        this.setCookie(res, token.access_token);
        res.status(200);
        res.send(token);
    }
    private setCookie(res: Response, token: string){
        res.cookie('accessToken', token, {
            httpOnly: true,
        });
    }

}
