import { IsOptional, IsInt, Min, IsIn } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    page: number;
    @IsOptional()
    @IsInt()
    @Min(1)
    pageSize: number
  
    @IsOptional()
    sortBy: string; 
  
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder: 'ASC' | 'DESC'  = 'ASC'

    condition : Record<string, any>;
  }
