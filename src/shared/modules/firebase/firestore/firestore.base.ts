import { ReceivedDocuments } from '@shared/interfaces';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  getFirestore,
  Query,
} from 'firebase-admin/firestore';
import { QUERY_BUILDER_MAP } from './firestore.constant';
import {
  BuildQuery,
  GetDocsTransformSettings,
  GetDocTransformSettings,
  Populate,
} from './firestore.interface';
import { transformDocToData } from './firestore.operators';

export abstract class FirestoreBase<T> {
  db: Firestore = getFirestore();

  protected abstract readonly collectionName: string;

  addDoc(document: T, settings?: GetDocTransformSettings): Promise<T> {
    return this.collection
      .add(document)
      .then((docRef) => docRef.get())
      .then((docSnapshot) => transformDocToData(docSnapshot))
      .then((doc: T) => this.transformDoc(doc, settings));
  }

  setDocData(docId: string, data: T): Promise<T> {
    return this.collection
      .doc(docId)
      .set(data)
      .then(() => ({
        id: docId,
        ...data,
      }));
  }

  updateDoc(
    id: string,
    document: Partial<T>,
    settings?: GetDocTransformSettings,
  ): Promise<T> {
    return this.collection
      .doc(id)
      .update(document)
      .then(async () => await this.getDocumentById(id, undefined, settings));
  }

  getDocuments(
    settings?: GetDocsTransformSettings,
  ): Promise<ReceivedDocuments<T>> {
    return this.buildQuery(settings?.buildQuery)
      .get()
      .then((snapshot) => {
        return snapshot.docs.map((doc) => transformDocToData<T>(doc));
      })
      .then(async (docs) => {
        const totalElements = await this.totalDocumentsCount;
        const pageSize = settings?.buildQuery?.limit || docs.length;

        return {
          elements: await this.transformDocs(docs, settings),
          pageSize: settings?.buildQuery?.limit || docs.length,
          pageNumber: settings?.buildQuery?.offset / pageSize + 1 || 1,
          totalElements,
          totalPages: Math.round(totalElements / pageSize),
        };
      });
  }

  getDocumentById(
    id: string,
    collectionName = this.collectionName,
    settings?: GetDocTransformSettings,
  ): Promise<T> {
    return this.db
      .collection(collectionName)
      .doc(id)
      .get()
      .then((snapshot) => transformDocToData(snapshot))
      .then((doc: T) => this.transformDoc(doc, settings));
  }

  findByIdAndDelete(id: string): Promise<void> {
    return this.collection.doc(id).delete().then();
  }

  get collection(): CollectionReference<DocumentData> {
    return this.db.collection(this.collectionName);
  }

  private get totalDocumentsCount(): Promise<number> {
    return this.collection
      .count()
      .get()
      .then((snap) => snap.data().count);
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
          ...(await this.populate(
            doc[typeof populate === 'string' ? populate : populate.field],
            populate,
          )),
        };
      },
      Promise.resolve({}),
    );

    return { ...doc, ...populatedProperties };
  }

  private async populate(
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

    return this.populate(obj[populate.field], populate.populate);
  }

  private async transformDoc(
    doc: T,
    settings: GetDocTransformSettings,
  ): Promise<T> {
    if (settings?.removeFields) {
      settings.removeFields.forEach((field) => delete doc[field]);
    }

    if (settings?.populate) {
      return await this.populateDoc(doc, settings.populate);
    }

    return doc;
  }

  private async transformDocs(
    docs: T[],
    settings: Omit<GetDocsTransformSettings, 'buildQuery'>,
  ): Promise<T[]> {
    if (settings?.removeFields) {
      docs.forEach((doc) => {
        settings.removeFields.forEach((field) => delete doc[field]);
      });
    }

    if (settings?.populate) {
      return await this.populateDocs(docs, settings.populate);
    }

    return docs;
  }

  private buildQuery(buildQuery: BuildQuery = {}): Query {
    return Object.entries(buildQuery).reduce((collection, [key, args]) => {
      if (key === 'filters') {
        return args.reduce((query, filter) => {
          if (Array.isArray(filter)) {
            return query[QUERY_BUILDER_MAP[key]](...filter);
          }

          return query[QUERY_BUILDER_MAP[key]](filter);
        }, collection);
      }

      if (Array.isArray(args)) {
        return collection[QUERY_BUILDER_MAP[key]](...args);
      }

      return collection[QUERY_BUILDER_MAP[key]](args);
    }, this.collection);
  }
}
