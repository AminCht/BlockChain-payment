import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/user.dto';

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService){}

    @UseGuards(AuthGuard(['jwt']))
    @Get('me')
    async getProfile(@Req() req: Request) {
        return await this.profileService.getProfile(req['user'].id);
    }
    
    @UseGuards(AuthGuard(['jwt']))
    @Patch('changepassword')
    async changePasswrod(@Req() req: Request, @Body() dto: ChangePasswordDto){
        return await this.profileService.changePassword(req['user'].id, dto);
    }


}
