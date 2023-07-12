import { DocumentSnapshot } from '@firebase/firestore';

export const transformDocToData = <T>(doc: DocumentSnapshot): T => {
  return {
    ...doc.data(),
    id: doc.id,
  } as T;
};
