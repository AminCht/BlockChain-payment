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
        query = query.where(condition);
        const pageCount = await query.getCount();
        const data = await query.skip(skip).take(take).getMany();
        return { data: data, page: page, pageSize: pageSize, pageCount: pageCount };
    }

}


