import { Filter, Query, WhereFilterOp } from 'firebase-admin/firestore';
import { OrderDirection } from './firestore.enum';

type OrderField = string;

export type OrderBy = [OrderField, OrderDirection];

export type Populate =
  | string
  | {
      field: string;
      populate?: Populate;
    };

export interface GetDocTransformSettings {
  populate?: Populate[];
  removeFields?: string[];
}

export type FilterQuery = [string, WhereFilterOp, any] | Filter;

export interface BuildQuery {
  filters?: FilterQuery[];
  orderBy?: OrderBy;
  limit?: number;
  // TODO [Komoff] add builders if need
}

export interface GetDocsTransformSettings extends GetDocTransformSettings {
  buildQuery?: BuildQuery;
}

export type QueryBuilderMap = {
  [key in keyof BuildQuery]: keyof Query;
};
