import { NotFoundException } from "@nestjs/common";

export class TransactionNotFoundException extends NotFoundException{
    constructor(id:number){
        super(`Transaction with id ${id} not found`);
    }
}