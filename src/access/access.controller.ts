import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessService } from './access.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTokensResponseDto } from './dto/getTokens.dto';

@ApiTags('Access')
@Controller('access')
export class AccessController {
    constructor(private accessService: AccessService) {}

    @ApiOperation({ summary: 'Get all supported tokens' })
    @ApiResponse({ status: 200, description: 'Get All Tokens as a List',type: [GetTokensResponseDto] })
    @Get('tokens')
    async getAllTokens() {
        return await this.accessService.getAllSupportedTokens();
    }

    @ApiOperation({ summary: 'Get user Currencies(should login before)' })
    @ApiResponse({ status: 200, description: 'Get All User Currencies',type: [GetTokensResponseDto] })
    @Get('myTokens')
    @UseGuards(AuthGuard(['jwt']))
    async getAllAccesses(@Req() req: Request){
        return await this.accessService.getAllUserAccess(req['user'].id);
    }
}
