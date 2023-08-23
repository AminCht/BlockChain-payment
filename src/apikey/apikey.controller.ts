import { Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApikeyService } from './apikey.service';
import { ApiKeyAuthGuard } from './guard/apikey.guard';
import { AuthGuard } from '@nestjs/passport';
import { EitherGuard } from './guard/either.guard';
import { Request } from 'express';
import { ApiKeyRequestDto, ApiKeyUpdateDto } from './dto/apikey.dto';

@ApiTags('ApiKey')
@Controller('apikey')
export class ApikeyController {
    constructor( private apikeyService: ApikeyService){}


    @Post()
    async createApiKey(@Req() req: Request, dto: ApiKeyRequestDto){
        return await this.apikeyService.createApiKey(req['user'].user, dto);
    }

    @Put(':id')
    @UseGuards(EitherGuard)
    async updateApiKey(@Req() req: Request, dto: ApiKeyUpdateDto){
        return await this.apikeyService.updateApiKey(req['user'].user, dto);
    }

    @Get()
    @UseGuards(ApiKeyAuthGuard)
    getAccess(@Req() req: Request){
        return req['user'].accesses;
    }
}
