import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRequestDto } from './dto/createAdmin.dto';

@Controller('admin')
export class AdminController {
    constructor( private adminService: AdminService){}


    @Post('create')
    async ctreateAdmin(@Body() createAdmindto: AdminRequestDto){
        return await this.adminService.createAdmin(createAdmindto);
    }

    @Post('login')
    async adminLogin(@Body() loginAdmindto: AdminRequestDto){
        return await this.adminService.adminLogin(loginAdmindto);
    }
}
