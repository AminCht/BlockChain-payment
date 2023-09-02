import {EntityMetadata, Repository, SelectQueryBuilder} from "typeorm";
import { PaginationDto } from "./pagination.dto";
import {Type} from "class-transformer";


export class Pagination {
    // TODO: whole response shold be created here
    static async paginate<T>(repository: Repository<T>, paginationDto: PaginationDto) {
        const { page, pageSize, sortBy, sortOrder } = paginationDto;
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        let query: SelectQueryBuilder<T> = repository.createQueryBuilder();
        //const entityMetadata: EntityMetadata = repository.metadata;
       // const tableName: string = entityMetadata.name;
        if (sortBy) {
            query = query.orderBy(sortBy, sortOrder);
        }
        query = query.where({ user: { id: 1 } });
        const pageCount = await query.getCount();
        const data = await query.skip(skip).take(take).getMany();
        return { data: data, pageCount: pageCount };
    }
}
