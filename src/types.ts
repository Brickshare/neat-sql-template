export type Primitive = string | number | boolean | null;
export type JSONObject = { [key: string]: JSONValue };
export type JSONArray = Array<JSONValue>;
export type JSONValue = Primitive | JSONObject | JSONArray;

export type QueryArg = Primitive | Date | Buffer | ArrayBuffer | JSONValue | QueryArg[];

export interface SQLTemplate {
  sql: string;
  values: QueryArg[];
}
