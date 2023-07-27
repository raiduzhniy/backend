import { OrderDirection } from '@shared/modules/firebase/firestore';

export interface TableQuery {
  orderBy?: string;
  orderDirection?: OrderDirection;
  pageNumber?: string;
  pageSize?: string;
}
