import { ObjectLiteral } from "typeorm";
import { ICondition } from "../../pagination/pagination.dto";

export class TransactionCondition implements ICondition {


    queryToCondition(query: any): ObjectLiteral {
        const result : ObjectLiteral = new Object();
        const amountObj: ObjectLiteral = new Object();
        const createdAtObj: ObjectLiteral = new Object();
        if (query.amount) {
            result.amount= query.amount;
        }
        if (query.amountGt || query.amountLt) {
            if (query.amountLt) {
                amountObj['Lt'] = query.amountLt
            }
            if(query.amountGt){
                amountObj['Gt'] = query.amountGt
            }
            result.amount  = amountObj
        }
        if (query.createdAtGt || query.createdAtLt) {
            if (query.createdAtLt) {
                createdAtObj['Lt'] = query.createdAtLt
            }
            if(query.createdAtGt){
                createdAtObj['Gt'] = query.createdAtGt
            }
            result.created_date  = createdAtObj;
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