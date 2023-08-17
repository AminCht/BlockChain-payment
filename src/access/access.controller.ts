import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessService } from './access.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('access')
export class AccessController {
    constructor(private accessService: AccessService) {}
    @Get('tokens')
    @UseGuards(AuthGuard(['jwt']))
    async getAllTokens() {
        return await this.accessService.getAllTokens();
    }

    @Get('')
    async getAllAccesses(){
        return await this.accessService.getAllAccesses();
    }
}
