import {
  QueryCompositeFilterConstraint,
  QueryNonFilterConstraint,
} from 'firebase/firestore';

export type Populate =
  | string
  | {
      field: string;
      populate?: Populate;
    };

export interface GetDocQuerySettings {
  populate?: Populate[];
  removeFields?: string[];
}

export interface GetDocsQuerySettings extends GetDocQuerySettings {
  filter?: QueryCompositeFilterConstraint;
  queryNonFilterConstraint?: QueryNonFilterConstraint[];
}
