export class GetTransactionByIdResponseDto{
    amount: string

    status: string

    created_date: Date

    expireTime: Date


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