import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/createPayment.dto';
@Injectable()
export class PaymentService {

    createPayment(dto: CreatePaymentDto){
        const currency = dto.currency;
        const network = dto.network;
        if(currency == 'eth' && network == 'ethereum'){


        }else{

        }
    }
}
