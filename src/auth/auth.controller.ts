import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthResponseDto, CreateUserResponseDto, CreateUserWithExistUsernameResponseDto, LoginUserResponseDto, UnAuthorizeResponseDto } from './dto/auth.dto';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}


    @ApiOperation({ summary: 'User Registeration' })
    @ApiResponse({ status: 400, description: 'This UserName has already taken', type: CreateUserWithExistUsernameResponseDto })
    @ApiResponse({ status: 201, description: 'user signup and get accessToken', type: CreateUserResponseDto })
    @Post('signup')
    async signUp(@Body() dto:AuthDto, @Res() res:Response): Promise<void>{
        const response = await this.authService.signUp(dto);
        res.status(201);
        res.send(response);
    }

    @ApiOperation({ summary: 'Login User' })
    @ApiResponse({ status: 401, description: 'unAuthorized', type: UnAuthorizeResponseDto})
    @ApiResponse({ status: 200, description: 'user signup and get accessToken', type: LoginUserResponseDto})
    @Post('login')
    async login(@Body() dto: AuthDto, @Res() res: Response): Promise<void>{
        const token = await this.authService.login(dto);
        this.setCookie(res, token.access_token);
        res.status(200);
        res.send({message: 'You have successfully logged in'});
    }
    private setCookie(res: Response, token: string){
        const currentDate = new Date();
        res.cookie('accessToken', token, {
            expires: new Date(currentDate.getTime() + 365 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        });
    }

}
