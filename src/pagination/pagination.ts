import { Relation, Repository, SelectQueryBuilder } from "typeorm";
import { ICondition, PaginationDto, RelationDto } from './pagination.dto';


export class Pagination {
    static async paginate<T,G extends ICondition>(repository: Repository<T>, paginationDto: PaginationDto<G>, mapper: Function | null=null, relations: RelationDto[]| null =null) {
        const { page, pageSize, orderBy, sortOrder, condition } = paginationDto;
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        let query: SelectQueryBuilder<T> = repository.createQueryBuilder('main');
        if (orderBy) {
            query = query.orderBy(orderBy, sortOrder);
        }
        query = Pagination.addRelations(query, relations);
        query = query.where(condition);
        const pageCount = await query.getCount();
        const data = await query.skip(skip).take(take).getMany();
        if(mapper){ 
            return { data: data.map((d)=> {
            return mapper(d);
            })
            , page: page, pageSize: pageSize, pageCount: pageCount };
        }
        
        return { data: data, page: page, pageSize: pageSize, pageCount: pageCount };
    }
    static addRelations<T>(query: SelectQueryBuilder<T>, relations: RelationDto[] | null ){
        if(!relations) return query;
        for(const relation of relations){
            if(relation.type == 'left') query = query.leftJoinAndSelect(`main.${relation.name}`, relation.name);
            if(relation.type == 'inner') query = query.innerJoinAndSelect(`main.${relation.name}`, relation.name);
            
        }
        return query;
    }

}


