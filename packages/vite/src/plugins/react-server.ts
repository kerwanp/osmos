import { createServerModuleRunner, parseAstAsync, ResolvedConfig } from "vite";
import { transformSource } from "react-server-dom-esm/node-loader";
import { PluginOption } from "vite";
import { buildImportProxy, createEntryName, hasDirective } from "../utils";
import { join, relative } from "path";

export type ReactServerPluginOptions = {
  environmentName: string;
};

export default function reactServer(
  options: ReactServerPluginOptions,
): PluginOption {
  return [
    reactServerEnvironment({
      environmentName: options.environmentName,
    }),
    reactServerTransform({
      environmentName: options.environmentName,
    }),
    reactServerDirective({
      environmentName: options.environmentName,
    }),
  ];
}

export type ReactServerEnvironmentPluginOptions = {
  environmentName: string;
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
        optimizeDeps: {
          include: [
            "react",
            "react/jsx-runtime",
            "react/jsx-dev-runtime",
            "react-server-dom-esm/server",
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
  const references = new Map<string, string>();
  let manifestPath: string;

  return {
    name: "osmos:react-server:transform",
    config() {
      return {
        build: {},
      };
    },
    async buildStart(opts) {
      if (this.environment.name !== "client") return;

      // We push client component to client entries
      for (const [id, entryName] of references) {
        if (Array.isArray(opts.input)) {
          opts.input.push(id);
        } else {
          opts.input[entryName] = id;
        }
      }

      // const test = this.emitFile({
      //   type: "asset",
      //   name: "client-references.json",
      //   source: JSON.stringify({}),
      // });

      // console.log("EMIITTTED", this.getFileName(manifestId));

      // const manifestPath = join(
      //   this.environment.config.build.outDir,
      //   ".vite",
      //   "client-references.json",
      // );
      //
      // console.log(manifestPath);

      // await writeFile(manifestPath, JSON.stringify({}));
    },
    async transform(code, id) {
      if (this.environment.name !== options.environmentName) return;

      const context = {
        format: "module",
        url: id,
      };

      let { source } = await transformSource(
        code,
        context,
        (source: string) => ({ source }),
      );

      if (source.length !== code.length) {
        // Client components are saved to be later included in client bundle
        const entryName = createEntryName(id);
        console.log(code, source);
        references.set(id, entryName);
      }

      return source;
    },
    generateBundle() {
      if (this.environment.name !== options.environmentName) return;

      const id = this.emitFile({
        type: "asset",
        name: "client-references.json",
        source: JSON.stringify({}),
      });

      const filename = this.getFileName(id);

      manifestPath = join(this.environment.config.build.outDir, filename);
    },
  };
}

export type ReactServerDomVirtualPluginOptions = {
  environmentName: string;

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

      for (const [_, { references }] of state.entries()) {
        for (const [id, entryName] of references) {
          if (Array.isArray(opts.input)) {
            // TODO: Not supported yet
            throw new Error(
              `Not supported: Tried to inject entry '${id}' to server bundle but 'rollupOptions.input' is not an object.`,
            );
          } else {
            opts.input[entryName] = id;
          }
        }
      }
    },
    async transform(source, id) {
      // We make sure we are not in the react server environment. That would cause infinite loop.
      if (this.environment.name === options.environmentName) {
        return;
      }

      // Directive pre-check for performances
      if (source.includes("use react-server")) {
        const ast = await parseAstAsync(source);
        if (!hasDirective(ast.body, options.directive ?? "use react-server"))
          return;

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

          // console.log("osmos", osmosDir);
          // console.log("relative", relativePath);
          console.log("TEST", join("../../../.osmos", relativePath));
          const hotfixPath = join("../../../../.osmos", relativePath);

          return buildImportProxy(id, hotfixPath, "import");
        }
      }
    },
  };
}
