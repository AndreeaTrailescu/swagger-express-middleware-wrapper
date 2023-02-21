declare module "api-spec-converter" {
  export type Formats =
    | "swagger_1"
    | "swagger_2"
    | "openapi_3"
    | "api_blueprint"
    | "io_docs"
    | "google"
    | "raml"
    | "wadl";
  export interface ConvertOptions {
    from: Formats;
    to: Formats;
    source: string | object;
  }
  export interface Converted {
    stringify: () => string;
  }

  export function convert(options: ConvertOptions): Promise<Converted>;
}
