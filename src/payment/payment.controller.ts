import { Body, Controller, Post, Get, UseFilters, Param, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { BadRequestResponseDto, CreatePaymentRequestDto, CreatePaymentResponseDto, UnAuthorizeResponseDto } from './dto/createPayment.dto';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionNotFoundExceptionFilter } from '../transaction/filters/transactionNotfound.filter';
import { GetTransactionByIdResponseDto, TransactionNotFoundResponseDto } from './dto/getTransactionById.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { EitherGuard } from '../apikey/guard/either.guard';

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
  @ApiResponse({ status: 400, description: 'Bad Request', type: BadRequestResponseDto })
  @ApiResponse({ status: 201, description: 'The transaction has been successfully created.',type: CreatePaymentResponseDto})
  @ApiResponse({ status: 401, description: 'unAuthorized', type: UnAuthorizeResponseDto })
  @ApiQuery({ name: 'currencyId'})
  @UseGuards(EitherGuard)
  async createPayment(@Req() req, @Body() createPaymentdto: CreatePaymentRequestDto): Promise <CreatePaymentResponseDto | string> {
    return await this.paymentService.createPayment(req['user'].id, createPaymentdto);
  }

  @Get('Transaction/:id')
  @UseFilters(TransactionNotFoundExceptionFilter)
  @ApiOperation({ summary: 'Get Transaction By id' })
  @ApiResponse({ status: 404, description: 'Transaction with given id not found', type: TransactionNotFoundResponseDto})
  @ApiResponse({ status: 200, description: 'Transaction found',type: GetTransactionByIdResponseDto})
  @ApiResponse({ status: 401, description: 'unAuthorized', type: UnAuthorizeResponseDto })
  @ApiParam({ name: 'id', description: 'Id should be numeric' })
  @UseGuards(EitherGuard)
  async getTransactionById(@Req() req:Request, @Param('id') id:string){
    return await this.transactionService.getTransactionById(req['user'], Number(id));
  }

}
