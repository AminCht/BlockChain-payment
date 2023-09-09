import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { BalanceService } from "./balance.service";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";

@Controller('balance')
export class BalanceController {
    constructor(private balanceService: BalanceService) {}
    @Get()
    @UseGuards(AuthGuard(['jwt']))
    private async getAllBalances(@Param('id') id: string, @Req() req: Request) {
        return await this.balanceService.getAllBalances(req['user'].id);
    }
    @Get(':id')
    @UseGuards(AuthGuard(['jwt']))
    private async getBalanceByTokenId(@Param('id') id: string,@Req() req: Request) {
        return await this.balanceService.getBalanceByTokenId(req['user'].id, Number(id));
  }
}
