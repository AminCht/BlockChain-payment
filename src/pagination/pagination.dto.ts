import { IsOptional, IsInt, Min, IsIn } from 'class-validator';

export class PaginationDto<T> {
    @IsOptional()
    @IsInt()
    @Min(1)
    page: number
  
    @IsOptional()
    @IsInt()
    @Min(1)
    pageSize: number
  
    @IsOptional()
    sortBy: string; 
  
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder: 'ASC' | 'DESC'  = 'ASC'

    @IsOptional()
    userId: string

    @IsOptional()
    status: string

    condition : T
  }
