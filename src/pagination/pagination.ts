import { Repository, SelectQueryBuilder } from "typeorm";
import { ICondition, PaginationDto } from './pagination.dto';


export class Pagination {
    static async paginate<T,G extends ICondition>(repository: Repository<T>, paginationDto: PaginationDto<G>, ) {
        const { page, pageSize, orderBy, sortOrder, condition } = paginationDto;
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        let query: SelectQueryBuilder<T> = repository.createQueryBuilder();
        if (orderBy) {
            query = query.orderBy(orderBy, sortOrder);
        }
        console.log(condition)
        //Pagination.rangeConditions(repository, condition, query)     
        query = query.where(condition);
        const pageCount = await query.getCount();
        const data = await query.skip(skip).take(take).getMany();
        return { data: data, page: page, pageSize: pageSize, pageCount: pageCount };
    }

    static rangeConditions(repository: any, condition: object, query: any){
        for (const key in condition) {
            if (condition.hasOwnProperty(key)) {
                const value = condition[key];
                const columnTypeFunction = repository.metadata.findColumnWithPropertyPath(key)?.type;
                if (typeof value === 'object' && 'Gt' || 'Lt' in value) {
                    if('Gt' in value){
                        if(columnTypeFunction === Date){
                            query = query.andWhere(`${key} >= :${key}1`, { [key+'1']: value['Gt']});
                        }else{
                            query = query.andWhere(`${key}::numeric >= :${key}1`, { [key+'1']: value['Gt']});
            
                        }
                    }
                    console.log(query.getParameters())
                    if('Lt' in value){
                        if(columnTypeFunction === Date){
                            
                            query = query.andWhere(`${key} <= :${key}2`, { [key+'2']: value['Lt']});
                        }
                        else{
                            query = query.andWhere(`${key}::numeric <= :${key}2`, { [key+'2']: value['Lt'] });
                        }
                    }
                    console.log(query.getParameters())
                } else {
                    const customCondition: { [key: string]: any } = {};
                    customCondition[key] = value;
                    query = query.andWhere(customCondition)
                }
            }
        } 
    }
}


