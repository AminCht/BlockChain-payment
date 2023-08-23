import {Body, Controller, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
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
    async createApiKey(@Req() req: Request, @Body() dto: ApiKeyRequestDto){
        console.log(req['user']);
        return await this.apikeyService.createApiKey(req['user'], dto);
    }

    @Put(':id')
    @UseGuards(EitherGuard)
    async updateApiKey(@Req() req: Request, @Body() dto: ApiKeyUpdateDto,@Param('id') id: number){
        return await this.apikeyService.updateApiKey(req['user'].id, dto, id);
    }

    @Get()
    @UseGuards(ApiKeyAuthGuard)
    getAccess(@Req() req: Request){
        return req['user'].accesses;
    }
}
