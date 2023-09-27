import { Transaction } from "../../database/entities/Transaction.entity";
import {ethers} from "ethers";


export enum Status {
    PENDING = 'Pending',
    SUCCESSFUL = 'Successful',
    FAILED = 'Failed'
}

export class GetTransactionByIdResponseDto{
    amount: string

    status: string

    created_date: Date

    expireTime: Date


    static ResponseToDto(transaction: Transaction){
        const responseDto = new GetTransactionByIdResponseDto(); 
        responseDto.amount  = responseDto.convertAmount(transaction.amount,transaction.currency.decimals);
        responseDto.status = responseDto.convertStatusNumber(transaction.status);
        responseDto.created_date = transaction.created_date;
        responseDto.expireTime =  transaction.expireTime;
        return responseDto;
    }
//todo: use ethers library to convert amount & change name to entitytodto
    public convertAmount(amount: string, decimal: number){
        const convertedAmount = ethers.parseUnits(amount, decimal);
        return String(convertedAmount);
    }
    public convertStatusNumber(status: number): string{
        if(status == 0){
            return Status.PENDING
        }
        else if(status == 1){
            return Status.SUCCESSFUL
        }
        return Status.FAILED
    }

}