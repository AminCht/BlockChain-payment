import { MoreThan,LessThan, ObjectLiteral, Between, Raw } from "typeorm";
import { ICondition } from "../../pagination/pagination.dto";

export class TransactionCondition implements ICondition {


    queryToCondition(query: any): ObjectLiteral {
        const result : ObjectLiteral = new Object();
        
        if (query.amount) {
            result.amount= query.amount;
        }
        if (query.amountGt || query.amountLt) {
            if(query.amountGt && query.amountLt){
                result.amount = Raw(
                    alias => `CAST(${alias} AS DECIMAL) BETWEEN :minAmount AND :maxAmount`,
                    {
                        minAmount: query.amountGt,
                        maxAmount: query.amountLt,
                    });
            }
            else if (query.amountLt) {
                result.amount = Raw(
                    alias => `CAST(${alias} AS DECIMAL)  >= :maxAmount`,
                    {
                        maxAmount: query.amountLt,
                    });
            }
            else if(query.amountGt){
                result.amount = Raw(
                    alias => `CAST(${alias} AS DECIMAL)  >= :minAmount`,
                    {
                        minAmount: query.amountGt,
                    });
            }
            
        }
        if (query.createdAtGt || query.createdAtLt) {
            if(query.createdAtGt && query.createdAtLt){
                const startDate = new Date(query.createdAtGt);
                const endDate = new Date(query.createdAtLt);
                const untillDate = this.getNextDayDate(endDate);
                  result.created_date = Between(startDate, untillDate);
            }
            else if (query.createdAtLt) {
                result.created_date = LessThan(query.createdAtLt)
            }
            else if(query.createdAtGt){
                result.created_date = MoreThan(query.createdAtGt)
            }
        }
        if (query.status) {
            result.status = query.status;
        }
        if(query.walletId){
            result.wallet = {id: query.walletId}
        }
        if(query.userId){
            result.user = {id: query.userId}
        }
        if(query.currencyId){
            result.currency = {id: query.currencyId}
        }
        return result;
    }
    getNextDayDate(date: Date){
        return new Date(date.getTime() + 24 * 60 * 60 * 1000)
    }
}