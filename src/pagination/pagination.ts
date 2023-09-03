import { Repository, SelectQueryBuilder} from "typeorm";
import { ICondition, PaginationDto } from "./pagination.dto";


export class Pagination {
    // TODO: whole response shold be created here
    static async paginate<T,G extends ICondition>(repository: Repository<T>, paginationDto: PaginationDto<G>) {
        const { page, pageSize, orderBy, sortOrder, condition } = paginationDto;
        console.log(page);
        console.log(pageSize)
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        let query: SelectQueryBuilder<T> = repository.createQueryBuilder();
        if (orderBy) {
            query = query.orderBy(orderBy, sortOrder);
        }
        query = query.where(condition);
        const pageCount = await query.getCount();
        const data = await query.skip(skip).take(take).getMany();
        // TODO: Whole response
        return { data: data, pageCount: pageCount };
    }
}
