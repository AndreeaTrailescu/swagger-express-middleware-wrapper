import createMiddleware from "swagger-express-middleware";
export interface Resource {
  data: unknown;
  collection: string;
  name: string;
}
export function createResource(
  collection: string,
  name: string,
  data: unknown
): Resource {
  // the datastore type is not implemented in the corresponding type definition
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (createMiddleware as any).Resource(collection, name, data);
}
