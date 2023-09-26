import { Transaction } from "../../database/entities/Transaction.entity"

export enum Status {
    PENDING = 'Pending',
    SUCCESSFUL = 'Successful',
    FAILED = 'Failed'
}
export class GetTransactionResponseDto{
    amount: string

    status: string

    wallet_balacne_before: string

    wallet_balacne_after: string


    created_date: Date

    expireTime: Date

    static ResponseToDto(transaction: Transaction){
        const responseDto = new GetTransactionResponseDto(); 
        responseDto.amount  = responseDto.convertAmount(transaction.amount,transaction.currency.decimals);
        responseDto.status = responseDto.convertStatusNumber(transaction.status);
        responseDto.wallet_balacne_before = responseDto.convertAmount(transaction.wallet_balance_before,transaction.currency.decimals);
        responseDto.wallet_balacne_after = responseDto.convertAmount(transaction.wallet_balance_after,transaction.currency.decimals);
        responseDto.created_date = transaction.created_date;
        responseDto.expireTime =  transaction.expireTime;
        return responseDto;
    }

    public convertAmount(amount: string, decimal: number){
        const convertedAmount =BigInt(amount) / BigInt(10) ** BigInt(decimal);
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