import type { NitroConfig } from 'nitropack/types'
import type { InlineConfig } from 'vite'
export interface ConfigSchema {
 /** @default "/home/martin/workspace/random/osmos/packages/osmos" */
 rootDir: string,

 /** @default "/home/martin/workspace/random/osmos/packages/osmos/src" */
 srcDir: string,

 /** @default "/home/martin/workspace/random/osmos/packages/osmos/src/app" */
 appDir: string,

 /** @default "/home/martin/workspace/random/osmos" */
 workspaceDir: string,

 /** @default "/home/martin/workspace/random/osmos/packages/osmos/.osmos" */
 buildDir: string,

 /** @default "/home/martin/workspace/random/osmos/packages/osmos/server" */
 serverDir: string,

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

 app: {
  /** @default "/" */
  baseURL: string,
 },

 css: Array<any>,

 devServer: {
  /** @default 3000 */
  port: number,

  host: any,

  /** @default false */
  https: boolean,
 },

 /**
  * Configuration for Nitro.
  * 
  * 
  * @see [Nitro configuration docs](https://nitro.unjs.io/config/)
 */
 nitro: NitroConfig,

 /**
  * Global route options applied to matching server routes.
  * 
  * 
  * @experimental This is an experimental feature and API may change in the future.
  * 
  * @see [Nitro route rules documentation](https://nitro.unjs.io/config/#routerules)
 */
 routeRules: NitroConfig['routeRules'],

 postcss: {
  /** @default ["autoprefixer"] */
  plugins: Array<string>,
 },

 /**
  * Configuration that will be passed directly to Vite.
  * 
  * 
  * @see [Vite configuration docs](https://vite.dev/config) for more information.
  * Please note that not all vite options are supported in Nuxt.
 */
 vite: InlineConfig,
}