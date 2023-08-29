import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto, UpdateWithdrawRequestDto } from './dto/withdraw.dto';
import { Request } from 'express';

@Controller('withdraw')
export class WithdrawController {
    constructor ( private withdrawService: WithdrawService){}

    @UseGuards(AuthGuard(['jwt']))
    @Get()
    async getAllWithdraws(@Req() req: Request){
       return await this.withdrawService.getAllWithdraws(req['user'].id); 
    }

    @UseGuards(AuthGuard(['jwt']))
    @Post()
    async createWithdraw(@Body() dto: CreateWithdrawDto, @Req() req: Request){
        return await this.withdrawService.createWithdraw(dto, req['user']);
    }

    @UseGuards(AuthGuard(['jwt']))
    @Patch(':id')
    async cancelWithdraw(@Param('id') withdrawId: string){
        return await this.withdrawService.cancelWithdraw(Number(withdrawId));
    }

    @UseGuards(AuthGuard(['jwt']))
    @Put(':id')
    async updateWithdraw(@Body() dto: UpdateWithdrawRequestDto, @Param('id') id: string, @Req() req: Request){
        return await this.withdrawService.updateWithdraw(dto, Number(id), req['user']);
    }
}
