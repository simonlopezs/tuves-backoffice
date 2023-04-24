import {
  collectionGroup,
  getFirestore,
  query,
  where,
  doc,
  getDocs,
  collection,
  limit,
  getDoc,
  Firestore,
  writeBatch,
  QueryDocumentSnapshot,
  DocumentData,
  orderBy,
  startAfter,
} from "firebase/firestore";
import { firebaseApp } from "./firebase";
import { FirebaseApp } from "firebase/app";
import { SessionHandler } from "./session-handler";
import { compact, last } from "lodash";
import { User } from "../classes/User";
import { IUser } from "../models";

export type Collection = "users" | "customers" | "decos";

export interface QueryOptions {
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  limit?: number;
  cursor?: QueryDocumentSnapshot<DocumentData>;
}

const defaultQueryOptions: QueryOptions = {
  orderBy: "createdAt",
  orderDirection: "desc",
  limit: 10,
  cursor: undefined,
};

export type DocumentCursor = QueryDocumentSnapshot<DocumentData> | undefined;

export class DbConnector {
  private db: Firestore;
  private basePath: string | null = "";

  constructor(app: FirebaseApp) {
    this.db = getFirestore(app);
  }

  setTenant(tenantId: string | null) {
    this.basePath = `tenants/${tenantId}`;
  }

  async get<T>(
    collectionName: Collection,
    queryOptions?: QueryOptions
  ): Promise<{ data: T[]; nextCursor: DocumentCursor }> {
    const {
      orderBy: _orderBy,
      limit: _limit,
      cursor,
      orderDirection,
    } = queryOptions || defaultQueryOptions;

    const queryConstraints = compact([
      orderBy(_orderBy || "createdAt", orderDirection || "desc"),
      cursor ? startAfter(cursor) : undefined,
      limit(_limit || 10),
    ]);
    return getDocs(
      query(
        collection(this.db, `${this.basePath}/${collectionName}`),
        ...queryConstraints
      )
    ).then((querySnapshot) => {
      const nextCursor = last(querySnapshot.docs);
      const data = querySnapshot.docs.map(
        (doc) => ({ ...doc.data(), _id: doc.id } as T)
      );
      return { data, nextCursor };
    });
  }

  async getUser(uid: string) {
    const _query = query(
      collectionGroup(this.db, "users"),
      where("uid", "==", uid),
      limit(1)
    );
    return getDocs(_query).then(
      (querySnapshot) => (querySnapshot.docs.at(0)?.data() as IUser) || null
    );
  }

  async getOne<T>(collectionName: string, id: string) {
    const docRef = doc(this.db, `${this.basePath}/${collectionName}`, id);
    return getDoc(docRef).then((doc) => doc.data() as T);
  }

  async saveBatch(collectionName: string, data: any[], idKey?: string) {
    // make chunks if data.length > 500
    const batch = writeBatch(this.db);
    data.forEach((item) => {
      const docRef = idKey
        ? doc(this.db, `${this.basePath}/${collectionName}`, item[idKey])
        : doc(collection(this.db, `${this.basePath}/${collectionName}`));
      batch.set(docRef, item);
    });
    return batch.commit();
  }

  // async update<T extends AppModel>() {
  //     return Promise.resolve()
  // }

  // async delete(collection: Collection, id: string) {
  //     return this.databases.deleteDocument(
  //         this.databaseId,
  //         this.getCollectionId(collection), id)
  // }

  // async searchByTerm<T extends AppModel>(collection: Collection, keys: string[], term: string) {
  //     return Promise.all(keys.map(async (key) => {
  //         return this.databases.listDocuments<T>(
  //             this.databaseId,
  //             this.getCollectionId(collection),
  //             [
  //                 Query.search(key, String(term)),
  //                 Query.limit(10)
  //             ]
  //         ).then((response) => response.documents)
  //     })).then((responses) => uniqBy(flatten(responses), '$id'))
  // }

  // private getCollectionId(collection: Collection) {
  //     return this.config.collectionsIds[collection]
  // }
}

const dbConnector = new DbConnector(firebaseApp);
const session = new SessionHandler(firebaseApp, dbConnector);

export { dbConnector, session };
