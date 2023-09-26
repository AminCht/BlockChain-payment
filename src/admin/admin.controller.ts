import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Res, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRequestDto, GetAllUsersResponseDto, CreateAdminResponseDto, LogingAdminResponseDto, UnAuthorizeResponseDto
    , DeleteAdminResponseDto, DeleteNotAdminResponseDto,CreateExistUsernameResponseDto, LogingWrongInfoAdminResponseDto } from './dto/createAdmin.dto';
import { WithdrawCondition } from "./dto/withdrawCondition.dto"
import { Request, Response} from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt.admin.guard';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { WalletCondition } from './dto/walletCondition';
import { TransactionCondition } from './dto/transactionCondition';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
    constructor( private adminService: AdminService){}

    @ApiOperation({ summary: 'Create Admin' })
    @ApiResponse({ status: 400, description: 'This UserName has already taken', type: CreateExistUsernameResponseDto })
    @ApiResponse({ status: 201, description: 'Create Admin and get message', type: CreateAdminResponseDto })
    @Post()
    @UseGuards(JwtAdminAuthGuard)
    public async createAdmin(@Body() createAdmindto: AdminRequestDto): Promise< { message: string }> {
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

    @ApiOperation({ summary: 'Get All users(Only Admin token to this)' })
    @ApiResponse({ status: 200, description: 'Get all users', type: [GetAllUsersResponseDto]})
    @ApiResponse({ status: 401, description: 'UnAuthorized Admin' , type: UnAuthorizeResponseDto})
    @Get('users')
    @UseGuards(JwtAdminAuthGuard)
    public async getAllUsers(): Promise <GetAllUsersResponseDto[]>{
        return await this.adminService.getAllUsers();
    }

    @ApiOperation({ summary: 'Get All Admins(Only Admin token to this)' })
    @ApiResponse({ status: 200, description: 'Get all Admins', type: [GetAllUsersResponseDto]})
    @ApiResponse({ status: 401, description: 'UnAuthorized Admin' , type: UnAuthorizeResponseDto})
    @Get('admins')
    @UseGuards(JwtAdminAuthGuard)
    public async getAllAdmins(): Promise<GetAllUsersResponseDto[]> {
        return await this.adminService.getAllAdmins();
    }

    @ApiOperation({ summary: 'Delete Admin (Only Admin have token to this and only admins can be deleted)' })
    @ApiResponse({ status: 200, description: 'Delete Admin', type: DeleteAdminResponseDto })
    @ApiResponse({ status: 401, description: 'UnAuthorized Admin', type: UnAuthorizeResponseDto })
    @ApiResponse({ status: 404, description: 'Delete User', type: DeleteNotAdminResponseDto })
    @Delete(':id')
    @UseGuards(JwtAdminAuthGuard)
    public async deleteAdmin( @Param('id') id: string): Promise <{ message: string }>{
        return await this.adminService.deleteAdmin(Number(id));
    }

    private setCookie(res: Response, token: string){
        const currentDate = new Date();
        res.cookie('accessToken', token, {
            expires: new Date(currentDate.getTime() + 365 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        });
    }

    @Get('withdraw')
    @UseGuards(JwtAdminAuthGuard)
    public async getWithdraw(@Req() req: Request) {
        const pagination = new PaginationDto<WithdrawCondition>(WithdrawCondition,req.query);
        return await this.adminService.getAllWithdraws(pagination);
    }

    @Get('wallets')
    public async getWallets(@Req() req: Request){
        const pagination = new PaginationDto<WalletCondition>(WalletCondition, req.query)
        return await this.adminService.getWallets(pagination);
    }

    @Get('transactions')
    public async getTransactions(@Req() req: Request){
        const pagination = new PaginationDto<TransactionCondition>(TransactionCondition, req.query);
        return await this.adminService.getTransactions(pagination);
    }
}
