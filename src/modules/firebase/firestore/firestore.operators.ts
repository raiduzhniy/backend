import {
  QueryDocumentSnapshot,
  DocumentSnapshot,
  DocumentData,
} from 'firebase-admin/firestore';

export const transformDocToData = <T>(
  doc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
): T => {
  return {
    ...doc.data(),
    id: doc.id,
  } as T;
};
