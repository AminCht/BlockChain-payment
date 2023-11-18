import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto, ChangePasswordResponseDto, GetProfileResponseDto } from './dto/user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService){}

    @ApiOperation({ summary: 'Get User Profile' })
    @ApiResponse({ status: 200, description: 'get user profile', type: GetProfileResponseDto })
    @UseGuards(AuthGuard(['jwt']))
    @Get('me')
    async getProfile(@Req() req: Request) {
        return await this.profileService.getProfile(req['user'].id);
    }
    
    @ApiOperation({ summary: 'Update users password' })
    @ApiResponse({ status: 200, description: 'update user password', type: ChangePasswordResponseDto })
    @UseGuards(AuthGuard(['jwt']))
    @Patch('changepassword')
    async changePasswrod(@Req() req: Request, @Body() dto: ChangePasswordDto){
        return await this.profileService.changePassword(req['user'].id, dto);
    }


}
