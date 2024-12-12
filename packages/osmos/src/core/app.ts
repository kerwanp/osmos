import { createDebugger, Hookable } from "hookable";
import { createNitro } from "../nitro/nitro";
import { Nitro, NitroConfig } from "nitropack/types";
import invariant from "invariant";
import { OsmosOptions } from "../config/types";
import consola, { ConsolaInstance } from "consola";
import { Promisable } from "../types";
import { installModules } from "../module/install";
import { ViteDevServer } from "vite";
import {
  createFileSystemRouter,
  FileSystemRouter,
} from "../router/file-system/router";

export type OsmosHooks = {
  "nitro:config": (config: NitroConfig) => Promisable<void>;
  "nitro:init": (nitro: Nitro) => Promisable<void>;
  "vite:dev:init": (vite: ViteDevServer) => Promisable<void>;
};

export class OsmosApp extends Hookable<OsmosHooks> {
  #nitro?: Nitro;

  options: OsmosOptions;
  logger: ConsolaInstance;
  router: FileSystemRouter;

  constructor(options: OsmosOptions) {
    super();
    this.options = options;
    this.logger = consola.withTag("osmos");
    this.router = createFileSystemRouter({
      dir: options.appDir,
      extensions: options.extensions,
    });

    if (this.options.debug) {
      createDebugger(this, { tag: "osmos" });
    }

    if (this.options.logLevel) {
      this.logger.level = this.options.logLevel;
    }

    this.logger.debug("Creating Osmos App");
  }

  async init() {
    this.logger.debug("Initializing Osmos App");

    await installModules(this);
    this.#nitro = await createNitro(this);
  }

  get nitro() {
    invariant(this.#nitro, "Nitro is not initialized yet");
    return this.#nitro;
  }
}

export async function createOsmos(options: OsmosOptions) {
  options.modules.unshift(
    await import("../runtime/client/module").then((r) => r.default),
    await import("../runtime/rsc/module").then((r) => r.default),
    await import("../runtime/ssr/module").then((r) => r.default),
  );

  return new OsmosApp(options);
}
