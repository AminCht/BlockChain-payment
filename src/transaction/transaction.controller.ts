import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
   
  constructor(private transactionService: TransactionService){}
    
  @Get(':id')
  getTransactionById(@Param('id', ParseIntPipe) id:number){
    return this.transactionService.getTransactionById(id);
  }
}
