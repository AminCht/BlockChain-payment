import { MoreThan,LessThan, ObjectLiteral, Between, Raw } from "typeorm";
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
            /*if (query.amountLt) {
                amountObj['Lt'] = LessThan(query.amountLt)
            }
            if(query.amountGt){
                amountObj['Gt'] = MoreThan(query.amountGt)
            }*/

            result.amount  = Between(query.amountGt, query.amountLt)
        }
        if (query.createdAtGt || query.createdAtLt) {
            if(query.createdAtGt && query.createdAtLt){
                const endDate = new Date(query.createdAtLt);
                result.created_date  = Raw(alias => `${alias} >= :startDate AND ${alias} <= :enddate`, {
                    startDate: query.createdAtGt,
                    enddate: new Date(endDate.getTime() + 24 * 60 * 60 * 1000)
                  });
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
}