import {Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApikeyService } from './apikey.service';
import { ApiKeyAuthGuard } from './guard/apikey.guard';
import { AuthGuard } from '@nestjs/passport';
import { EitherGuard } from './guard/either.guard';
import { Request } from 'express';
import { ApiKeyRequestDto, ApiKeyResponseDto, ApiKeyUpdateDto, GetAccessResponseDto, UnAuthorizedResponseDto } from './dto/apikey.dto';

@ApiTags('ApiKey')
@Controller('apikey')
export class ApikeyController {
    constructor( private apikeyService: ApikeyService){}
    @Post()
    @ApiOperation({summary: 'Create ApiKey'})
    @ApiResponse({ status: 401, description: 'unAuthorized and return a message', type: UnAuthorizedResponseDto})
    @ApiResponse({ status: 201, description: 'create an apikey and return it', type: ApiKeyResponseDto})
    @UseGuards(AuthGuard(['jwt']))
    async createApiKey(@Req() req: Request, @Body() dto: ApiKeyRequestDto){
        return await this.apikeyService.createApiKey(req['user'], dto);
    }
    @Patch(':id')
    @ApiOperation({summary: 'Update an ApiKey'})
    @ApiResponse({ status: 401, description: 'unAuthorized and return a message', type: UnAuthorizedResponseDto})
    @ApiResponse({ status: 200, description: 'Update apikey with given id and return it', type: ApiKeyResponseDto})
    @UseGuards(AuthGuard(['jwt']))
    async updateApiKey(@Req() req: Request, @Body() dto: ApiKeyUpdateDto,@Param('id') id: number){
        return await this.apikeyService.updateApiKey(req['user'].id, dto, id);
    }
    @Get('endpoints')
    @ApiOperation({summary: 'Get all endpoints'})
    async getAllEndpoints() {
        return await this.apikeyService.getAllEndPoints();
    }

    @Get()
    @ApiOperation({summary: 'Get token of apikey'})
    @ApiResponse({ status: 401, description: 'unAuthorized and return a message', type: UnAuthorizedResponseDto})
    @ApiResponse({ status: 200, description: 'Update apikey with given id and return it', type: [GetAccessResponseDto]})
    @UseGuards(AuthGuard(['jwt']))
    async getApiKeys(@Req() req: Request) {
        return await this.apikeyService.getApiKeys(req['user'].id);
    }
    @Get(':id')
    @ApiOperation({summary: 'Get token of apikey'})
    @ApiResponse({ status: 401, description: 'unAuthorized and return a message', type: UnAuthorizedResponseDto})
    @ApiResponse({ status: 200, description: 'Update apikey with given id and return it', type: [GetAccessResponseDto]})
    @UseGuards(AuthGuard(['jwt']))
    async getApiKeysById(@Req() req: Request, @Param('id') id: number) {
        return await this.apikeyService.getApiKeysById(req['user'].id, id);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Delete Apikey'})
    @UseGuards(AuthGuard(['jwt']))
    async deleteApiKey(@Req() req: Request, @Param('id') id: number){
        return await this.apikeyService.deleteApiKey(req['user'].id, id);
    }

    @ApiOperation({summary: 'Get token of apikey'})
    @ApiResponse({ status: 401, description: 'unAuthorized and return a message', type: UnAuthorizedResponseDto})
    @ApiResponse({ status: 200, description: 'Update apikey with given id and return it', type: [GetAccessResponseDto]})
    @UseGuards(ApiKeyAuthGuard)
    getAccess(@Req() req: Request){
        return req['user'].accesses;
    }
}
