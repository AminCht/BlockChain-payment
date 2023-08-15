import { Body, Controller, Post, Get, UseFilters, Param, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentRequestDto, CreatePaymentResponseDto, Currency, Network } from './dto/createPayment.dto';

import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionNotFoundExceptionFilter } from '../transaction/filters/transactionNotfound.filter';
import { GetTransactionByIdResponseDto } from './dto/getTransactionById.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private transactionService: TransactionService
    )
     {}

  @Post()
  @ApiOperation({ summary: 'Create transaction(payment)' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 201, description: 'The transaction has been successfully created.',type: CreatePaymentResponseDto})
  @ApiQuery({ name: 'Network', enum: Network })
  @ApiQuery({ name: 'Currency', enum: Currency })
  @UseGuards(AuthGuard(['jwt']))
  async createPayment(@Req() req:Request, @Body() createPaymentdto: CreatePaymentRequestDto): Promise <CreatePaymentResponseDto> {
    return await this.paymentService.createPayment(req, createPaymentdto);
  }

  @Get('Transaction/:id')
  @UseFilters(TransactionNotFoundExceptionFilter)
  @ApiOperation({ summary: 'Get Transaction By id' })
  @ApiResponse({ status: 404, description: 'Transaction with given id not found' })
  @ApiParam({ name: 'id', description: 'Id should be numeric' })
  @ApiResponse({ status: 200, description: 'Transaction found',type: GetTransactionByIdResponseDto})
  @UseGuards(AuthGuard(['jwt']))
  async getTransactionById(@Req() req:Request, @Param('id') id:string){
    return await this.transactionService.getTransactionById(req, +id);
  }

}
