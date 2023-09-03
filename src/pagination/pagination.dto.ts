import { IsOptional, IsInt, Min, IsIn } from 'class-validator';
import { ObjectLiteral } from "typeorm";
import { WithdrawCondition } from '../admin/dto/withdrawCondition.dto';

export interface ICondition {
    queryToCondition(query: any): ObjectLiteral 
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
    orderBy: string; 
  
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder: 'ASC' | 'DESC'

    condition : ObjectLiteral;

    conditionMaker: G

    // TODO: Consider default values
    queryToPaginationDto<G extends ICondition>(query: any, conditionMaker): PaginationDto<G> {
        const result = new PaginationDto<G>();
        result.conditionMaker = conditionMaker
        if (query.page) {
            result.page = query.page;
        }
        if (query.pageSize) {
            result.pageSize = query.pageSize;
        }
        if (query.orderBy) {
            result.orderBy = query.orderBy;
        }
        if (query.sort) {
            result.sortOrder = query.sort;
        }
        result.condition = result.conditionMaker.queryToCondition(query);
        return result
    }

  }
