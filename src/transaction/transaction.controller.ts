import { Controller, Get, Param, ParseIntPipe, UseFilters } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { UserNotFoundExceptionFilter } from './filters/transactionNotfound.filter';

@Controller('transaction')
export class TransactionController {
   
  constructor(private transactionService: TransactionService){}
    
  @UseFilters(UserNotFoundExceptionFilter)
  @Get(':id')
  async getTransactionById(@Param('id', ParseIntPipe) id:number){
    return await this.transactionService.getTransactionById(id);
  }
}
