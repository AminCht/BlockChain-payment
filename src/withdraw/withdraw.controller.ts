import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto } from './dto/withdraw.dto';
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
        return await this.withdrawService.cancelWithDraw(Number(withdrawId));
    }
}
