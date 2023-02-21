import { Resource } from "./Resource";

type DataStoreMethod =
  | ((...resources: [Resource, ...Resource[], ResourcesCallback]) => void)
  | ((resource: Resource) => void);
export type ResourceCallback = (err: Error, resource: Resource) => void;
export type ResourcesCallback = (err: Error, resources: Resource[]) => void;

export interface MemoryDataStore {
  resources: Resource[];

  get: (resource: string | Resource, callback?: ResourceCallback) => void;

  save: DataStoreMethod;

  delete: DataStoreMethod;

  getCollection: (collection: string, callback?: ResourcesCallback) => void;

  deleteCollection: (collection: string, callback?: ResourceCallback) => void;
}
