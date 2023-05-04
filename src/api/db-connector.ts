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
  startAt,
  endAt,
} from "firebase/firestore";
import { firebaseApp } from "./firebase";
import { FirebaseApp } from "firebase/app";
import { SessionHandler } from "./session-handler";
import {
  chunk,
  compact,
  flatten,
  last,
  mapValues,
  orderBy as _orderBy,
} from "lodash";
import { IUser } from "../models";
import { LngLat } from "../models/LngLat.model";
import * as Geofire from "geofire-common";

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

const DEFAULT_LIMIT = 10;
const DEFAULT_RADIUS_IN_KM = 10;

export type ResponseData<T> = { data: T[]; nextCursor: DocumentCursor };

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
  ): Promise<ResponseData<T>> {
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
      limit(_limit || DEFAULT_LIMIT),
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
  async getByGeohash<T>(
    collectionName: Collection,
    cursor: DocumentCursor,
    center: LngLat | null
  ): Promise<ResponseData<T>> {
    if (!center) return { data: [], nextCursor: cursor };
    const { lat, lng } = center;
    const radiusInM = DEFAULT_RADIUS_IN_KM * 1000;
    const bounds = Geofire.geohashQueryBounds([lat, lng], radiusInM);
    return Promise.all(
      bounds.map((b) =>
        getDocs(
          query(
            collection(this.db, `${this.basePath}/${collectionName}`),
            orderBy("geohash"),
            startAt(b[0]),
            endAt(b[1])
          )
        )
      )
    )
      .then((snapshots) => flatten(snapshots.map((s) => s.docs)))
      .then((docs) => {
        const matchingDocs: { doc: QueryDocumentSnapshot; distance: number }[] =
          [];
        docs.forEach((doc) => {
          const _lng = doc.get("lng");
          const _lat = doc.get("lat");
          const distanceInKm = Geofire.distanceBetween(
            [_lat, _lng],
            [lat, lng]
          );
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            matchingDocs.push({ doc, distance: distanceInM });
          }
        });

        const data = _orderBy(matchingDocs, ["distance", "asc"])
          .map((d) => d.doc)
          .map(
            (doc) => ({ ...this.formatDates(doc.data()), _id: doc.id } as T)
          );
        return { data, nextCursor: undefined };
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
    const chunks = chunk(data, 500);
    for (const chunk of chunks) {
      const batch = writeBatch(this.db);
      chunk.forEach((item) => {
        const docRef = idKey
          ? doc(this.db, `${this.basePath}/${collectionName}`, item[idKey])
          : doc(collection(this.db, `${this.basePath}/${collectionName}`));
        batch.set(docRef, item);
      });
      await batch.commit();
    }
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
}

const dbConnector = new DbConnector(firebaseApp);
const session = new SessionHandler(firebaseApp, dbConnector);

export { dbConnector, session };
