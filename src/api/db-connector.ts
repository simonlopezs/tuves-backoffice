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
  Timestamp,
  setDoc,
  addDoc,
  or,
  QueryConstraint,
} from "firebase/firestore";
import { firebaseApp } from "./firebase";
import { FirebaseApp } from "firebase/app";
import { SessionHandler } from "./session-handler";
import { compact, flatten, last, mapValues } from "lodash";
import { IUser } from "../models";

export type Collection = "users" | "customers" | "decos";

export interface QueryOptions {
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  limit?: number;
  cursor?: QueryDocumentSnapshot<DocumentData>;
  filters?: Filter[];
  filterMode?: "and" | "or";
}

export interface Filter {
  key: string;
  operator: "==" | "<" | ">" | "<=" | ">=" | "!=" | "array-contains" | "in";
  value: any;
}

const defaultQueryOptions: QueryOptions = {
  orderBy: "createdAt",
  orderDirection: "desc",
  limit: 10,
  cursor: undefined,
  filterMode: "and",
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
      filters: _filters,
      filterMode,
    } = queryOptions || defaultQueryOptions;

    const filters =
      _filters?.map((filter) =>
        where(filter.key, filter.operator, filter.value)
      ) || [];

    const queryConstraints = compact([
      filterMode === "or" ? or(...filters) : filters,
      orderBy(_orderBy || "createdAt", orderDirection || "desc"),
      cursor ? startAfter(cursor) : undefined,
      limit(_limit || 10),
    ]);
    return getDocs(
      query(
        collection(this.db, `${this.basePath}/${collectionName}`),
        ...flatten(queryConstraints as any[])
      )
    ).then((querySnapshot) => {
      const nextCursor = last(querySnapshot.docs);
      const data = querySnapshot.docs.map(
        (doc) => ({ ...this.formatDates(doc.data()), _id: doc.id } as T)
      );
      return { data, nextCursor };
    });
  }

  private formatDates(obj: Object) {
    return mapValues(obj, (v) => (v instanceof Timestamp ? v.toDate() : v));
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

  async save(collectionName: string, data: any, id?: string) {
    const baseArgs: [Firestore, string] = [
      this.db,
      `${this.basePath}/${collectionName}`,
    ];
    return id
      ? setDoc(doc(...baseArgs, id), data)
      : addDoc(collection(...baseArgs), data);
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
