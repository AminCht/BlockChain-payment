import { Repository, SelectQueryBuilder } from "typeorm";
import { PaginationDto } from "./pagination.dto";


export class PaginationHelper {
  static paginate<T>(withdraw: Repository<T>, paginationDto: PaginationDto) {
        const { page, pageSize, sortBy, sortOrder } = paginationDto;
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        let query: SelectQueryBuilder<T> = withdraw.createQueryBuilder();
        if (sortBy) {
            query = query.orderBy(sortBy, sortOrder);
        }
        return query.skip(skip).take(take)
  }
}
