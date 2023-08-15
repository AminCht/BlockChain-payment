import { Body, Controller, Post, Get, UseFilters, Param, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentRequestDto, CreatePaymentResponseDto, Currency, Network } from './dto/createPayment.dto';

import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionNotFoundExceptionFilter } from '../transaction/filters/transactionNotfound.filter';
import { GetTransactionByIdResponseDto } from './dto/getTransactionById.dto';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private transactionService: TransactionService
    )
     {}

  @UseGuards(JwtStrategy)
  @Post()
  @ApiOperation({ summary: 'Create transaction(payment)' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 201, description: 'The transaction has been successfully created.',type: CreatePaymentResponseDto})
  @ApiQuery({ name: 'Network', enum: Network })
  @ApiQuery({ name: 'Currency', enum: Currency })
  async createPayment(@Req() req:Request, @Body() createPaymentdto: CreatePaymentRequestDto): Promise <CreatePaymentResponseDto> {
    return await this.paymentService.createPayment(req, createPaymentdto);
  }

  @UseGuards(JwtStrategy)
  @Get('Transaction/:id')
  @UseFilters(TransactionNotFoundExceptionFilter)
  @ApiOperation({ summary: 'Get Transaction By id' })
  @ApiResponse({ status: 404, description: 'Transaction with given id not found' })
  @ApiParam({ name: 'id', description: 'Id should be numeric' })
  @ApiResponse({ status: 200, description: 'Transaction found',type: GetTransactionByIdResponseDto})
  async getTransactionById(@Req() req:Request, @Param('id') id:string){
    return await this.transactionService.getTransactionById(req, +id);
  }

}
