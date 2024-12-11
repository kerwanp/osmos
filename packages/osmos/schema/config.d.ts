export interface ConfigSchema {
 app: {
  /** @default "/" */
  baseURL: string,
 },

 /** @default "/home/martin/workspace/random/osmos/packages/osmos" */
 rootDir: string,

 /** @default "/home/martin/workspace/random/osmos/packages/osmos/src" */
 appDir: string,

 /** @default "/home/martin/workspace/random/osmos" */
 workspaceDir: string,

 /** @default "/home/martin/workspace/random/osmos/packages/osmos/.osmos" */
 buildDir: string,

 modules: Array<any>,

 /** @default ["js","jsx","ts","tsx"] */
 extensions: Array<string>,

 /** @default false */
 dev: boolean,

 /** @default false */
 test: boolean,

 /** @default false */
 debug: boolean,

 /** @default 3 */
 logLevel: number,
}