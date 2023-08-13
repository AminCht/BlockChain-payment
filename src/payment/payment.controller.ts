import { Body, Controller, Post, Get, UseFilters, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentRequestDto, CreatePaymentResponseDto } from './dto/createPayment.dto';

import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionNotFoundExceptionFilter } from '../transaction/filters/transactionNotfound.filter';
import { GetTransactionByIdResponseDto } from './dto/getTransactionById.dto';

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
  async createPayment(@Body() createPaymentdto: CreatePaymentRequestDto): Promise <CreatePaymentResponseDto> {
    return await this.paymentService.createPayment(createPaymentdto);
  }

  @Get('Transaction/:id')
  @UseFilters(TransactionNotFoundExceptionFilter)
  @ApiOperation({ summary: 'Get Transaction By id' })
  @ApiResponse({ status: 404, description: 'Transaction with given id not found' })
  @ApiResponse({ status: 200, description: 'Transaction found',type: GetTransactionByIdResponseDto})
  async getTransactionById(@Param('id') id:string){
    return await this.transactionService.getTransactionById(+id);
  }

}
