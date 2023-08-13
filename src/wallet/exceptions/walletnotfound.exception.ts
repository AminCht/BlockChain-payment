import { NotFoundException } from "@nestjs/common";

export class WalletNotFoundException extends NotFoundException{
    constructor(address:string){
        super(`Wallet with address ${address} not found`);
    }
}