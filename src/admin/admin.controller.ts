import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminRequestDto } from './dto/createAdmin.dto';

@Controller('admin')
export class AdminController {
    constructor( private adminService: AdminService){}


    @Post('')
    async ctreateAdmin(@Body() createAdmindto:CreateAdminRequestDto){
        return await this.adminService.createAdmin(createAdmindto);
    }
}
