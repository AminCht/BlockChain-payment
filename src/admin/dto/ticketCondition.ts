import { ObjectLiteral } from "typeorm";
import { ICondition } from "../../pagination/pagination.dto";

export class TicketCondition implements ICondition {


    queryToCondition(query: any): ObjectLiteral {
        const result : ObjectLiteral = new Object();
        
        if (query.status) {
            result.status = query.status;
        }
        if(query.userId){
            result.user = {id: query.userId}
        }
        if(query.subject){
            result.subject = {id: query.currencyId}
        }
        return result;
    }
}