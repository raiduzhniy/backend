import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  addDoc,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';
import {
  Populate,
  GetDocsQuerySettings,
  GetDocQuerySettings,
} from './firestore.interface';
import { transformDocToData } from './firestore.operators';
import { FirestoreService } from './firestore.service';

export abstract class FirestoreBase<T> {
  protected abstract readonly collectionName: string;

  protected constructor(private firestoreService: FirestoreService) {}

  addDoc(document: T): Promise<DocumentReference<DocumentData, DocumentData>> {
    // TODO [Komoff] make it with transformDocToData
    return addDoc(this.collection, document);
  }

  getDocuments(settings?: GetDocsQuerySettings): Promise<T[]> {
    return getDocs(
      query(
        this.collection,
        settings?.filter,
        ...(settings?.queryNonFilterConstraint || []),
      ),
    )
      .then((snapshot) =>
        snapshot.docs.map((doc) => transformDocToData<T>(doc)),
      )
      .then(async (documents) => {
        if (settings.removeFields) {
          documents.forEach((doc) => {
            settings.removeFields.forEach((field) => delete doc[field]);
          });
        }

        if (settings.populate) {
          return await this.populateDocs(documents, settings.populate);
        }

        return documents;
      });
  }

  getDocumentById(
    id: string,
    collectionName = this.collectionName,
    settings?: GetDocQuerySettings,
  ): Promise<T> {
    return getDoc(doc(this.firestoreService.db, collectionName, id))
      .then((doc) => transformDocToData(doc))
      .then(async (doc) => {
        if (settings?.removeFields) {
          settings.removeFields.forEach((field) => delete doc[field]);
        }

        if (settings?.populate) {
          return await this.populateDoc(doc, settings.populate);
        }

        return doc;
      });
  }

  findByIdAndDelete(id: string): Promise<void> {
    return deleteDoc(doc(this.firestoreService.db, this.collectionName, id));
  }

  get collection(): CollectionReference<DocumentData, DocumentData> {
    return collection(this.firestoreService.db, this.collectionName);
  }

  private async populateDocs(
    documents: T[],
    populates: Populate[],
  ): Promise<T[]> {
    return await Promise.all(
      documents.map(async (doc) => {
        return await this.populateDoc(doc, populates);
      }),
    );
  }

  private async populateDoc(doc, populates: Populate[]) {
    const populatedProperties = await populates.reduce(
      async (resObj, populate) => {
        return {
          ...(await resObj),
          ...(await this.testForNow(
            doc[typeof populate === 'string' ? populate : populate.field],
            populate,
          )),
        };
      },
      Promise.resolve({}),
    );

    return { ...doc, ...populatedProperties };
  }

  private async testForNow(
    obj,
    populate: Populate,
  ): Promise<{ [key: string]: unknown | unknown[] }> {
    const getData = async (
      idOrIds: string | string[],
      collectionName: string,
    ) => {
      let result;
      if (Array.isArray(idOrIds)) {
        result = await Promise.all(
          idOrIds.map(
            async (id) => await this.getDocumentById(id, collectionName),
          ),
        );
      } else {
        result = this.getDocumentById(idOrIds, collectionName);
      }

      return { [collectionName]: result };
    };

    if (typeof populate === 'string' || !populate.populate) {
      const collectionName =
        typeof populate === 'string' ? populate : populate.field;

      return getData(obj, collectionName);
    }

    return this.testForNow(obj[populate.field], populate.populate);
  }
}
