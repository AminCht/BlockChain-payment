import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto, GetWithdrawDto, UpdateWithdrawRequestDto } from "./dto/withdraw.dto";
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateTicketResponseDto } from "../ticket/dto/ticket.dto";

@ApiTags('withdraw')
@Controller('withdraw')
export class WithdrawController {
    constructor ( private withdrawService: WithdrawService){}

    @ApiOperation({ summary: 'get all withdraws' })
    @ApiResponse({ status: 200, type: GetWithdrawDto })
    @UseGuards(AuthGuard(['jwt']))
    @Get()
    async getAllWithdraws(@Req() req: Request){
       return await this.withdrawService.getAllWithdraws(req['user'].id); 
    }

    @UseGuards(AuthGuard(['jwt']))
    @Post()
    @ApiOperation({ summary: 'post a withdraw' })
    async createWithdraw(@Body() dto: CreateWithdrawDto, @Req() req: Request){
        return await this.withdrawService.createWithdraw(dto, req['user']);
    }

    @UseGuards(AuthGuard(['jwt']))
    @ApiOperation({ summary: 'patch a withdraw' })
    @ApiResponse({ status: 200, type: UpdateWithdrawRequestDto })
    @Patch(':id')
    async cancelWithdraw(@Param('id') withdrawId: string){
        return await this.withdrawService.cancelWithdraw(Number(withdrawId));
    }

    @UseGuards(AuthGuard(['jwt']))
    @ApiOperation({ summary: 'put a withdraw' })
    @ApiResponse({ status: 200, type: UpdateWithdrawRequestDto })
    @Put(':id')
    async updateWithdraw(@Body() dto: UpdateWithdrawRequestDto, @Param('id') id: string, @Req() req: Request){
        return await this.withdrawService.updateWithdraw(dto, Number(id), req['user']);
    }
}
