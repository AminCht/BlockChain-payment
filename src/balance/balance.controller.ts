import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { BalanceService } from "./balance.service";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UpdateWithdrawRequestDto } from "../withdraw/dto/withdraw.dto";
import { BalanceRequestDto } from "./dto/balance.dto";

@ApiTags('balance')
@Controller('balance')
export class BalanceController {
    constructor(private balanceService: BalanceService) {}
    @Get()
    @ApiOperation({ summary: 'get balances for all coins' })
    @ApiResponse({ status: 200, type: [BalanceRequestDto] })
    @UseGuards(AuthGuard(['jwt']))
    private async getAllBalances(@Req() req: Request) {
        return await this.balanceService.getAllBalances(req['user'].id);
    }
    @Get(':id')
    @ApiOperation({ summary: 'get balances for a coins with id' })
    @ApiResponse({ status: 200, type: BalanceRequestDto })
    @UseGuards(AuthGuard(['jwt']))
    private async getBalanceByTokenId(@Param('id') id: string,@Req() req: Request) {
        return await this.balanceService.getBalanceByTokenId(req['user'].id, Number(id));
  }
}
