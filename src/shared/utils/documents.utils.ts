import { TableQuery } from '@shared/interfaces';
import { PaginateQuery } from '@shared/modules/firebase/firestore';

export class DocumentsUtils {
  static createBuildQueryFromQueryParams({
    orderBy,
    orderDirection,
    pageSize,
    pageNumber,
  }: TableQuery = {}): PaginateQuery {
    return {
      ...(pageSize ? { limit: +pageSize } : {}),
      ...(pageNumber && pageSize
        ? { offset: (+pageNumber - 1) * +pageSize }
        : { offset: 0 }),
      ...(orderBy ? { orderBy: [orderBy, orderDirection] } : {}),
    };
  }
}
