import { IsOptional, IsInt, Min, IsIn } from 'class-validator';
import { ObjectLiteral } from "typeorm";
export interface ICondition {
    queryToCondition(query: any): ObjectLiteral 
};

export class PaginationDto<G extends ICondition> {
    constructor(private conditionType: new () => G, query: any) {
        this.conditionMaker = new this.conditionType();
        if (query.page) {
            this.page = query.page;
        } else {
            this.page = 1;
        }
        if (query.pageSize) {
            this.pageSize = query.pageSize;
        } else {
            this.pageSize = 4;
        }
        if (query.orderBy) {
            this.orderBy = query.orderBy;
        }
        if (query.sort) {
            this.sortOrder = query.sort;
        }
        this.condition = this.conditionMaker.queryToCondition(query);
    }

    @IsOptional()
    @IsInt()
    @Min(1)
    page: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    pageSize: number;

    @IsOptional()
    orderBy: string;

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder: 'ASC' | 'DESC';

    condition: ObjectLiteral;

    conditionMaker: G;
}