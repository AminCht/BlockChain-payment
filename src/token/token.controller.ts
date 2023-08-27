import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { TokenService } from './token.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTokensResponseDto } from './dto/getTokens.dto';
import {EitherGuard} from "../apikey/guard/either.guard";

@ApiTags('Access')
@Controller('access')
export class TokenController {
    constructor(private accessService: TokenService) {}

    @ApiOperation({ summary: 'Get all supported tokens' })
    @ApiResponse({ status: 200, description: 'Get All Tokens as a List',type: [GetTokensResponseDto] })
    @Get('tokens')
    @UseGuards(EitherGuard)
    async getAllTokens() {
        return await this.accessService.getAllSupportedTokens();
    }

    @ApiOperation({ summary: 'Get user Currencies(should login before)' })
    @ApiResponse({ status: 200, description: 'Get All User Currencies',type: [GetTokensResponseDto] })
    @Get('myTokens')
    @UseGuards(EitherGuard)
    async getAllAccesses(@Req() req: Request){
        return await this.accessService.getAllUserAccess(req['user'].id);
    }
}
