import { createServerModuleRunner, ResolvedConfig } from "vite";
import { transformSource } from "react-server-dom-esm/node-loader";
import { PluginOption } from "vite";
import { buildImportProxy, createEntryName, createHash } from "../utils";
import { join, relative } from "path";
import { $global } from "../global";
import serverManifest from "./server-manifest";

export type ReactServerPluginOptions = {
  environmentName?: string;
  entry: string;
  outDir: string;
};

export default function reactServer({
  environmentName = "server",
  entry,
  outDir,
}: ReactServerPluginOptions): PluginOption {
  return [
    reactServerEnvironment({
      environmentName,
      entry: entry,
      outDir,
    }),
    reactServerTransform({
      environmentName,
    }),
    reactServerDirective({
      environmentName,
      modules: [
        "/home/martin/workspace/random/osmos/packages/osmos/src/server/runtime/renderer.tsx",
      ],
    }),
    serverManifest(),
    reactServerRefresh(),
  ];
}

export type ReactServerEnvironmentPluginOptions = {
  environmentName: string;
  entry: string;
  outDir: string;
};

export function reactServerEnvironment(
  options: ReactServerEnvironmentPluginOptions,
): PluginOption {
  return {
    name: "osmos:react-server:environment",
    config() {
      return { environments: { [options.environmentName]: {} } };
    },
    configEnvironment(name) {
      if (name !== options.environmentName) return;
      return {
        build: {
          target: "esnext",
          outDir: options.outDir,
          rollupOptions: {
            input: {
              index: options.entry,
            },
          },
        },
        optimizeDeps: {
          include: [
            "react",
            "react/jsx-runtime",
            "react/jsx-dev-runtime",
            "react-server-dom-esm/server",
            "react-server-dom-esm/client",
          ],
          esbuildOptions: {
            target: "esnext",
          },
        },
        resolve: {
          conditions: ["module", "react-server"],
          noExternal: true,
        },
      };
    },
    async configureServer(server) {
      const env = server.environments[options.environmentName];
      const runner = createServerModuleRunner(env);
      globalThis.__vite_rsc_runner = runner;
    },
  };
}

export type ReactServerTransformPluginOptions = {
  environmentName: string;
};

export function reactServerTransform(
  options: ReactServerTransformPluginOptions,
): PluginOption {
  const assetsVirtualId = "virtual:react-server:assets";
  const $assetsVirtualId = `\0${assetsVirtualId}`;

  return {
    name: "osmos:react-server:transform",
    resolveId(id) {
      // if (id === manifestVirtualId) {
      //   return $manifestVirtualId;
      // }

      if (id === assetsVirtualId) {
        return $assetsVirtualId;
      }
    },
    buildStart() {
      if (this.environment.name === "client") {
        for (const [id] of $global.clientReferences.entries()) {
          this.emitFile({
            type: "chunk",
            id,
            preserveSignature: "strict",
          });
        }
      }
    },
    async load(id) {
      if (this.environment.name === options.environmentName) return;

      if (id === $assetsVirtualId) {
        if (this.environment.mode === "dev") {
          return [
            `export default {`,
            ...[...$global.clientReferences.entries()].map(
              ([id, { hash, fileName }]) =>
                `'${hash}': { import: () => import('${id}'), clientAsset: '${fileName}' },`,
            ),
            "}",
          ].join("\n");
        } else {
          return [
            `export default {`,
            ...[...$global.clientReferences.entries()].map(
              ([id, { hash, fileName }]) =>
                `'${hash}': { import: () => import('${id}'), clientAsset: '${fileName}' },`,
            ),
            "}",
          ].join("\n");
        }
      }
    },
    async transform(code, id) {
      if (this.environment.name !== options.environmentName) return;

      const url = this.environment.mode === "dev" ? id : generateAssetUrl(id);

      const context = {
        format: "module",
        url,
      };

      let { source } = await transformSource(
        code,
        context,
        (source: string) => ({ source }),
      );

      if (source.length !== code.length) {
        // Client References are stored to generate the manifest.
        $global.clientReferences.set(id, { hash: url, fileName: id });
      }

      return source;
    },
    async generateBundle(_, bundle) {
      if (this.environment.name === "client") {
        const chunks = Object.values(bundle).filter((a) => a.type === "chunk");

        for (const [id, value] of $global.clientReferences.entries()) {
          const chunk = chunks.find((chunk) => chunk.facadeModuleId === id);
          if (!chunk) {
            throw new Error(
              `An error occured while retrieving chunk ${id} from client bundle.`,
            );
          }

          $global.clientReferences.set(id, {
            ...value,
            fileName: `/${chunk.fileName}`,
          });
        }
      }
    },
  };
}

export type ReactServerDomVirtualPluginOptions = {
  environmentName: string;

  modules: string[];

  /**
   * Directive used to define a module living in the React Server runtime.
   *
   * @default "use react-server"
   */
  directive?: string;
};

/**
 * Creates a new directive (eg. "use react-server").
 *
 * - In dev: Imported modules are loaded through the module runner.
 * - In build: Imported modules are added to the server entry and referenced as the import path.
 */
export function reactServerDirective(
  options: ReactServerDomVirtualPluginOptions,
): PluginOption {
  const state = new Map<string, { references: Map<string, string> }>();
  let resolvedConfig: ResolvedConfig;

  return {
    name: "osmos:react-server:directive",
    perEnvironmentStartEndDuringDev: true,
    configResolved(config) {
      resolvedConfig = config;
    },
    buildStart(opts) {
      state.set(this.environment.name, { references: new Map() });
      if (this.environment.name !== options.environmentName) return;

      opts.input["renderer"] =
        "/home/martin/workspace/random/osmos/packages/osmos/src/server/runtime/renderer.tsx";
    },
    async transform(_source, id) {
      // We make sure we are not in the react server environment. That would cause infinite loop.
      if (this.environment.name === options.environmentName) {
        return;
      }

      // Directive pre-check for performances
      if (options.modules.includes(id)) {
        if (this.environment.mode === "dev") {
          return buildImportProxy(id, id, "__vite_rsc_runner.import");
        }

        if (this.environment.mode === "build") {
          const entryName = createEntryName(id);

          state.get(this.environment.name)!.references.set(id, entryName);

          const outDir =
            resolvedConfig.environments[options.environmentName].build.outDir;

          const entryPath = join(outDir, `${entryName}.js`);

          // TODO: Hotfix for having build work
          const osmosDir = join(
            this.environment.config.build.outDir,
            "../../../.osmos",
          );

          const relativePath = relative(osmosDir, entryPath);

          const hotfixPath = join("../../../../.osmos", relativePath);

          return buildImportProxy(id, hotfixPath, "import");
        }
      }
    },
  };
}

export function reactServerRefresh(): PluginOption {
  return {
    name: "osmos:react-server:refresh",
    hotUpdate(ctx) {
      if (this.environment.name !== "client") return;
      console.log(ctx.file, "test");

      this.environment.hot.send({ type: "custom", event: "rsc-update" });

      return [];
    },
  };
}

/**
 * Generates a random asset url for references.
 */
function generateAssetUrl(_moduleId: string) {
  return createHash(12);
}
