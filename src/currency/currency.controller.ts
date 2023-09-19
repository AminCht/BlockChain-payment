import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { JwtAdminAuthGuard } from '../auth/guards/jwt.admin.guard';
import {
    CreateCurrencyDto,
    CreateTokenDto,
    CurrencyNotFoundResponseDto,
    GetCurrenciesResponseDto,
    UnAuthorizeResponseDto,
    UpdateCurrencyDto
} from './dto/Currency.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {

    constructor(private currencyService: CurrencyService){}

    @ApiOperation({ summary: 'Get All Currencies' })
    @ApiResponse({ status: 200, description: 'return all currencies', type: [GetCurrenciesResponseDto]})
    @Get()
    async getAllCurrrencies(){
        return await this.currencyService.getAllCurrencies();
    }

    @ApiOperation({ summary: 'Get Currenciy by id' })
    @ApiResponse({ status: 200, description: 'return currency with given id as a parameter', type: GetCurrenciesResponseDto})
    @ApiResponse({ status: 404, description: 'Currency not found and return a message', type: CurrencyNotFoundResponseDto})
    @Get('/:id/')
    async getCurrencybyId(@Param('id') id: string){
        return await this.currencyService.getCurrencyById(Number(id));
    }


    @ApiOperation({ summary: 'Create a currency' })
    @ApiResponse({ status: 200, description: 'Create a currency and return it as a response', type: GetCurrenciesResponseDto})
    @ApiResponse({ status: 401, description: 'return Unauthorize and status code 401 if an admin dont send this request', type: UnAuthorizeResponseDto})
    @Post()
    //@UseGuards(JwtAdminAuthGuard)
    async addCurrency(@Body() dto: CreateCurrencyDto){
        return await this.currencyService.addCurrency(dto);
    }

    @ApiOperation({ summary: 'Create a token' })
    @ApiResponse({ status: 200, description: 'Create a token and return it as a response', type: GetCurrenciesResponseDto})
    @ApiResponse({ status: 401, description: 'return Unauthorize and status code 401 if an admin dont send this request', type: UnAuthorizeResponseDto})
    @Post('token')
    //@UseGuards(JwtAdminAuthGuard)
    async addTokenCurrency(@Body() dto: CreateTokenDto){
        return await this.currencyService.addTokenCurrency(dto);
    }

    @ApiOperation({ summary: 'Update a Currencies' })
    @ApiResponse({ status: 200, description: 'Update a currency and return it as a response', type: GetCurrenciesResponseDto})
    @ApiResponse({ status: 401, description: 'return Unauthorize and status code 401 if an admin dont send this request', type: UnAuthorizeResponseDto})
    @Put(':id')
    @UseGuards(JwtAdminAuthGuard)
    async updateCurrency(@Param('id') id: string, @Body() dto: UpdateCurrencyDto){
        return await this.currencyService.UpdateCurrency(Number(id), dto);
    }
    @ApiOperation({ summary: 'Delete a Currencies' })
    @ApiResponse({ status: 200, description: 'Delete a currency and return a message as a response', type: GetCurrenciesResponseDto})
    @ApiResponse({ status: 401, description: 'return Unauthorize and status code 401 if an admin dont send this request', type: UnAuthorizeResponseDto})
    @ApiResponse({ status: 404, description: 'Currency not found and return a message', type: CurrencyNotFoundResponseDto})
    @Delete(':id')
    @UseGuards(JwtAdminAuthGuard)
    async deleteCurrency(@Param('id') id: number) {
        return await this.currencyService.DeleteCurrency(id);
    }


    @Get('price/token')
    async getPrice(){
        return await this.currencyService.getPrice();
    }
}
