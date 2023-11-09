import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService){}

    @UseGuards(AuthGuard(['jwt']))
    @Get('me')
    async getProfile(@Req() req: Request) {
        return await this.profileService.getProfile(req['user'].id);
    }
}
