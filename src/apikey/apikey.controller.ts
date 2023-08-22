import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApikeyService } from './apikey.service';
import { ApiKeyAuthGuard } from './guard/apikey.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('ApiKey')
@Controller('apikey')
export class ApikeyController {
    constructor( private apikeyService: ApikeyService){}


    @Get()
    @UseGuards(AuthGuard('ApiKey-Strategy'))
    async createApiKey(){
    }
}
