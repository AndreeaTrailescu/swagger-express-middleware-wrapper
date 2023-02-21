/* eslint-disable @typescript-eslint/no-explicit-any */
import createMiddleware from "swagger-express-middleware";
import { convert, Formats } from "api-spec-converter";
import { Express, RequestHandler } from "express";
import { createResource, ResourceCallback, ResourcesCallback } from "./types";

export type Method = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
export interface CustomImplementation {
  method: Method;
  path: string;
  getHandler: (store: DataStore) => RequestHandler;
}

export interface DataStore {
  save: (key: string, name: string, data: unknown) => Promise<void>;
  load: (key: string, callback?: ResourceCallback) => Promise<Error | unknown>;
  loadCollection: (
    key: string,
    callback?: ResourcesCallback
  ) => Promise<Error | Array<unknown>>;
}

export const store: DataStore = {
  load: async (key: string, callback?: ResourceCallback) => {
    dataStore.get(key, callback);
  },
  save: async (key: string, name: string, data: unknown) => {
    return dataStore.save(createResource(key, name, data));
  },

  loadCollection: async (key: string, callback?: ResourcesCallback) => {
    return dataStore.getCollection(key, callback);
  },
};

const dataStore = new (createMiddleware as any).MemoryDataStore();

export async function createMiddlewareFromApiSpec(
  app: Express,
  api: {
    source: string;
    specVersion: Formats;
  },
  prefillDataStore: (store: DataStore) => void,
  customImplementations: Array<CustomImplementation>
) {
  const swaggerTwo = await convert({
    source: api.source,
    from: api.specVersion,
    to: "swagger_2",
  });
  const convertedContent = JSON.parse(swaggerTwo.stringify());

  // the datastore type is not implemented in the corresponding type definition
  prefillDataStore(store);

  createMiddleware(convertedContent, app, (_err, middleware) => {
    app.use(
      middleware.metadata(),
      middleware.CORS(),
      middleware.files(),
      middleware.parseRequest(),
      middleware.validateRequest(),
      // the datastore type is not implemented in the corresponding type definition
      middleware.mock(dataStore as any)
    );
  });

  customImplementations.forEach((implementation) => {
    const handler = implementation.getHandler(store);
    makeRequest(app, implementation.method, implementation.path, handler);
  });
}

export function makeRequest(
  app: Express,
  method: Method,
  path: string,
  getHandler: RequestHandler
) {
  const methodName = method.toLowerCase() as keyof Express;
  app[methodName](path, getHandler);
}
