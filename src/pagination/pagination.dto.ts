import { IsOptional, IsInt, Min, IsIn } from 'class-validator';
import { ObjectLiteral } from "typeorm";

export interface ICondition {
    queryToCondtion(query: any): ObjectLiteral 
};

export class PaginationDto<G extends ICondition> {
    @IsOptional()
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    pageSize: number
  
    @IsOptional()
    sortBy: string; 
  
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder: 'ASC' | 'DESC'  = 'ASC'

    condition : ObjectLiteral;

    conditionMaker: G

    // TODO: Consider default values
    queryToPaginationDto<G extends ICondition>(query: any, ): PaginationDto<G> {
        const result = new PaginationDto<G>();
        if (query.page) {
            result.page = query.page;
        }
        if (query.pageSize) {
            result.pageSize = query.pageSize;
        }
        if (query.sortBy) {
            result.sortBy = query.sortBy;
        }
        if (query.sortOrder) {
            result.sortOrder = query.sortOrder;
        }
        result.condition = result.conditionMaker.queryToCondtion(query);
        return result;
    }

  }
