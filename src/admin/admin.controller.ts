import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRequestDto, GetAllUsersResponseDto, CreateAdminResponseDto, LogingAdminResponseDto, UnAuthorizeResponseDto
    , DeleteAdminResponseDto, DeleteNotAdminResponseDto, DeleteAdminByNotAdminResponseDto, GetAllUserByNotAdminResponseDto, CreateExistUsernameResponseDto, LogingWrongInfoAdminResponseDto } from './dto/createAdmin.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from '../database/entities/User.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
    constructor( private adminService: AdminService){}

    @ApiOperation({ summary: 'Create Admin' })
    @ApiResponse({ status: 400, description: 'This UserName has already taken', type: CreateExistUsernameResponseDto })
    @ApiResponse({ status: 201, description: 'Create Admin and get message', type: CreateAdminResponseDto })
    @Post('create')
    public async createAdmin(@Body() createAdmindto: AdminRequestDto) {
        return await this.adminService.createAdmin(createAdmindto);
    }

    @ApiOperation({ summary: 'Admin Login' })
    @ApiResponse({ status: 403, description: 'Credentials incorrect', type: LogingWrongInfoAdminResponseDto })
    @ApiResponse({ status: 200, description: 'Logging Admin in and get message', type: LogingAdminResponseDto })
    @Post('login')
    public async adminLogin(@Body() loginAdmindto: AdminRequestDto, @Res() res: Response): Promise <void>{
        const token = await this.adminService.adminLogin(loginAdmindto);
        this.setCookie(res, token.access_token);
        res.send({message: 'You have successfully logged in'});
    }

    @ApiOperation({ summary: 'Delete Admin (Only Admin have access to this and only admins can be deleted)' })
    @ApiResponse({ status: 200, description: 'Delete Admin', type: DeleteAdminResponseDto })
    @ApiResponse({ status: 401, description: 'UnAuthorized Admin', type: UnAuthorizeResponseDto })
    @ApiResponse({ status: 403, description: 'Only Admins can delete admin', type: DeleteAdminByNotAdminResponseDto })
    @ApiResponse({ status: 404, description: 'Delete User', type: DeleteNotAdminResponseDto })
    @Delete(':id')
    @UseGuards(AuthGuard(['jwt']))
    public async deleteAdmin( @Param('id') id: string, @Req() req: Request): Promise <{ message: string }>{
        return await this.adminService.deleteAdmin(+id, req['user']);
    }

    @ApiOperation({ summary: 'Get All users(Only Admin access to this)' })
    @ApiResponse({ status: 200, description: 'Get all users', type: [GetAllUsersResponseDto]})
    @ApiResponse({ status: 401, description: 'UnAuthorized Admin' , type: UnAuthorizeResponseDto})
    @ApiResponse({ status: 403, description: 'Only Admins can see all users', type: GetAllUserByNotAdminResponseDto })
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
