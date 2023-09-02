import { Repository, SelectQueryBuilder } from "typeorm";
import { PaginationDto } from "./pagination.dto";


export class PaginationHelper {
    // TODO: whole response shold be created here
    static async paginate<T>(withdraw: Repository<T>, paginationDto: PaginationDto<T>)  {
        const { page, pageSize, sortBy, sortOrder } = paginationDto;
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        let query: SelectQueryBuilder<T> = withdraw.createQueryBuilder();
        if (sortBy) {
            query = query.orderBy(sortBy, sortOrder);
        }
        query = query.where({
            id: 1
        }).skip(skip).take(take)
        const count = await PaginationHelper.getCount(query);
        return query;
    }

    static async getCount<T>(query: SelectQueryBuilder<T>): Promise<Number> {
        return await query.getCount();
    }

}
