import { ObjectLiteral } from "typeorm";
import { ICondition } from "../../pagination/pagination.dto";

export class TransactionCondition implements ICondition {


    queryToCondition(query: any): ObjectLiteral {
        const result : ObjectLiteral = new Object();
        if (query.amount) {
            result.amount= query.amount;
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
}