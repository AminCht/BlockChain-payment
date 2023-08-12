import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/createPayment.dto';

import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}
  @Post()
  @ApiOperation({ summary: 'Create transaction(payment)' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 201, description: 'The transaction has been successfully created.'})
  async createPayment(@Body() createPaymentdto: CreatePaymentDto) {
    return await this.paymentService.createPayment(createPaymentdto);
  }
}
