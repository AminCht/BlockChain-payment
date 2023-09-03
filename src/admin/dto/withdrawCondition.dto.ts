import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { ObjectLiteral } from "typeorm";
import { ICondition } from "../../pagination/pagination.dto";

// TODO: Add better validation
export class WithdrawCondition implements ICondition {
    static statuses = {
        'pending': 0,
        'failed': 1,
        'canceled': 2,
    }

    @ApiProperty()
    @IsOptional()
    userId: number;

    @ApiProperty()
    @IsOptional()
    status: number;

    queryToCondition(query: any): ObjectLiteral {
        const result : ObjectLiteral = new Object(); 
        if (query.userId) {
            result.user = {id: query.userId};
        }
        if (query.status) {
            result.status = WithdrawCondition.statusToStatusNumber(query.status);
        }
        return result;
    }

    static statusToStatusNumber(status: string): number {
        return WithdrawCondition.statuses[status];
    }
}

