
export class GetTransactionResponseDto{
    amount: string

    status: string

    wallet_balacne_before: string

    wallet_balacne_after: string

    created_date: string

    expireTime: string

    public static convertAmount(amount: string, decimal: number){
        const convertedAmount =BigInt(amount) / BigInt(10) ** BigInt(decimal);
        return String(convertedAmount);
    }
    public static convertStatusNumber(status: number): string{
        if(status == 0){
            return 'Pending'
        }
        else if(status == 1){
            return 'Sucssesful'
        }
        return 'Failed'
    }
}