import { Repository, SelectQueryBuilder} from "typeorm";
import { ICondition, PaginationDto } from "./pagination.dto";


export class Pagination {
    // TODO: whole response shold be created here
    static async paginate<T,G extends ICondition>(repository: Repository<T>, paginationDto: PaginationDto<G>) {
        const { page, pageSize, sortBy, sortOrder } = paginationDto;
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        let query: SelectQueryBuilder<T> = repository.createQueryBuilder();
        if (sortBy) {
            query = query.orderBy(sortBy, sortOrder);
        }
        query = query.where(paginationDto.condition);
        const pageCount = await query.getCount();
        const data = await query.skip(skip).take(take).getMany();
        // TODO: Whole response
        return { data: data, pageCount: pageCount };
    }
}
