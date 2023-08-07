import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/createPayment.dto';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService){}

    @Post('')
    createPayment(@Body() dto:CreatePaymentDto){
        return this.paymentService.createPayment(dto);
    }


}
