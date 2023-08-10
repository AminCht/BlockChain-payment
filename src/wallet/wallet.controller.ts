import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletNotFoundExceptionFilter } from './filters/walletnotfound.filter';

@Controller('wallet')
export class WalletController {
    constructor(private walletService:WalletService){}

    @UseFilters(WalletNotFoundExceptionFilter)
    @Get(':address')
    getWalletBalance(@Param('address') walletAdress :string){
        return this.walletService.getWalletBalance(walletAdress);
    }
}
