import { Controller, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
    constructor(private walletService:WalletService){}

    @Post('')
    createWallet(){
        return this.walletService.createWallet();
    }
}
