import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRequestDto } from './dto/createAdmin.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from '../database/entities/User.entity';

@Controller('admin')
export class AdminController {
    constructor( private adminService: AdminService){}


    @Post('create')
    public async createAdmin(@Body() createAdmindto: AdminRequestDto): Promise <{message: string}>{
        return await this.adminService.createAdmin(createAdmindto);
    }

    @Post('login')
    public async adminLogin(@Body() loginAdmindto: AdminRequestDto, @Res() res: Response): Promise <void>{
        const token = await this.adminService.adminLogin(loginAdmindto);
        this.setCookie(res, token.access_token);
        res.send({message: 'You have successfully logged in'});
    }


    @Delete(':id')
    public async deleteAdmin( @Param('id') id: string, @Req() req: Request){
        return await this.adminService.deleteAdmin(+id, req['user']);
    }

    @Get('AllUsers')
    @UseGuards(AuthGuard(['jwt']))
    public async getAllUsers(@Req() req: Request): Promise <User[]>{
        return await this.adminService.getAllUsers(req['user']);
    }

    private setCookie(res: Response, token: string){
        res.cookie('accessToken', token, {
            httpOnly: true,
        });
    }
}
