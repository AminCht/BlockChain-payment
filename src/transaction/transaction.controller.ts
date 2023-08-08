import { Controller, Get, Param, ParseIntPipe, UseFilters } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { UserNotFoundExceptionFilter } from './filters/transactionNotfound.filter';

@Controller('transaction')
export class TransactionController {
   
  constructor(private transactionService: TransactionService){}
    
  @UseFilters(UserNotFoundExceptionFilter)
  @Get(':id')
  getTransactionById(@Param('id', ParseIntPipe) id:number){
    return this.transactionService.getTransactionById(id);
  }
}
