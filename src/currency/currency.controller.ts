import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { JwtAdminAuthGuard } from '../auth/guards/jwt.admin.guard';
import { CreateCurrencyDto, UpdateCurrencyDto } from './dto/Currency.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {

    constructor(private currencyService: CurrencyService){}

    @Get()
    async getAllCurrrencies(){
        return await this.currencyService.getAllCurrencies();
    }

    @Get(':id')
    async getCurrencybyId(@Param('id') id: string){
        return await this.currencyService.getCurrencyById(Number(id));
    }

    @Post()
    @UseGuards(JwtAdminAuthGuard)
    async addCurrency(@Body() dto: CreateCurrencyDto){
        return await this.currencyService.addCurrency(dto);
    }

    @Put(':id')
    @UseGuards(JwtAdminAuthGuard)
    async updateCurrency(@Param('id') id: string, @Body() dto: UpdateCurrencyDto){
        return await this.currencyService.UpdateCurrency(Number(id), dto);
    }

    @Delete(':id')
    @UseGuards(JwtAdminAuthGuard)
    async deleteCurrency(@Param('id') id: string){
        return await this.currencyService.DeleteCurrency(Number(id));
    }

}
