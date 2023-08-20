import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRequestDto } from './dto/createAdmin.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from '../database/entities/User.entity';

@Controller('admin')
export class AdminController {
    constructor( private adminService: AdminService){}


    @Post('create')
    private async createAdmin(@Body() createAdmindto: AdminRequestDto): Promise <{message: string}>{
        return await this.adminService.createAdmin(createAdmindto);
    }

    @Post('login')
    private async adminLogin(@Body() loginAdmindto: AdminRequestDto, @Res() res: Response): Promise <void>{
        const token = await this.adminService.adminLogin(loginAdmindto);
        this.setCookie(res, token.access_token);
        res.send({message: 'You have successfully logged in'});
    }

    @Get('AllUsers')
    @UseGuards(AuthGuard(['jwt']))
    private async getAllUsers(@Req() req: Request): Promise <User[]>{
        return await this.adminService.getAllUsers(req['user']);
    }

    private setCookie(res: Response, token: string){
        res.cookie('accessToken', token, {
            httpOnly: true,
        });
    }
}
