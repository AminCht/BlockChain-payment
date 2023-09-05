import { Repository, SelectQueryBuilder, getConnection } from "typeorm";
import { ICondition, PaginationDto } from './pagination.dto';


export class Pagination {
    static gooz: any;
    static async paginate<T,G extends ICondition>(repository: Repository<T>, paginationDto: PaginationDto<G>, ) {
        const { page, pageSize, orderBy, sortOrder, condition } = paginationDto;
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        let query: SelectQueryBuilder<T> = repository.createQueryBuilder();
        if (orderBy) {
            query = query.orderBy(orderBy, sortOrder);
        }
        console.log(condition)
        for (const key in condition) {
            if (condition.hasOwnProperty(key)) {
                const value = condition[key];
                const columnTypeFunction = repository.metadata.findColumnWithPropertyPath(key)?.type;
                if (typeof value === 'object' && 'Gt' || 'Lt' in value) {
                    if('Gt' in value){
                        if(columnTypeFunction === Date){
                            query = query.where(`${key} >= :value`, { value: value['Gt']});
                        }else{
                            console.log(value['Gt'])
                            query = query.where(`${key}::numeric >= :value`, { value: value['Gt']});
                        }
                    }
                    if('Lt' in value){
                        if(columnTypeFunction === Date){
                            
                            query = query.andWhere(`${key} <= :value`, { value: value['Lt']});
                        }
                        else{
                            console.log(value['Lt'])
                            query = query.andWhere(`${key}::numeric <= :value`, { value: value['Lt'] });
                        }
                    }
                } else {
                    /*const customCondition: { [key: string]: any } = {};
                    customCondition[key] = value;
                    query = query.andWhere(customCondition)*/
                }
            }
        }

        //query = query.where(condition);
        const pageCount = await query.getCount();
        const data = await query.skip(skip).take(take).getMany();
        return { data: data, page: page, pageSize: pageSize, pageCount: pageCount };
    }

}


