import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { ObjectLiteral } from "typeorm";
import { ICondition } from "../../pagination/pagination.dto";

export class WalletCondition implements ICondition {


    queryToCondition(query: any): ObjectLiteral {
        const result : ObjectLiteral = new Object();
        if (query.lock) {
            result.lock= query.lock;
        }
        if (query.status) {
            result.status = query.status;
        }
        if(query.network){
            result.wallet_network = query.network
        }
        if(query.type){
            result.type = query.type
        }
        return result;
    }
}