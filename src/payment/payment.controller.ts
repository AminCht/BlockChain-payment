import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/createPayment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}
  @Post()
  async createPayment(@Body() createPaymentdto: CreatePaymentDto) {
    return await this.paymentService.createPayment(createPaymentdto);
  }
}
