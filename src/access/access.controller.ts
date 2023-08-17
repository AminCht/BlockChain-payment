import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessService } from './access.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('access')
export class AccessController {
    constructor(private accessService: AccessService) {}
    @Get('tokens')
    async getAllTokens() {
        return await this.accessService.getAllTokens();
    }

    @Get('')
    @UseGuards(AuthGuard(['jwt']))
    async getAllAccesses(@Req() req: Request){
        return await this.accessService.getAllUserAccess(req['user'].id);
    }
}
