import {
  createServerModuleRunner,
  EnvironmentOptions,
  PluginOption,
} from "vite";
import { transformSource } from "react-server-dom-esm/node-loader";
import { ModuleRunner } from "vite/module-runner";
import { createHash } from "crypto";

export type ReactServerOptions = {
  outDir: string;
  entry: string;
};

const clientReferences = new Map<string, string>();

export default function reactServer(options: ReactServerOptions) {
  return [test(options)];
}

function test(options: ReactServerOptions): PluginOption {
  const clientReferencesId = "$osmos/client-references";
  const $clientReferencesId = `\0${clientReferencesId}`;

  return {
    name: "osmos:react-server",
    config(config) {
      config.environments = {
        ...config.environments,
        rsc: environment(options),
      };
    },
    async configureServer(server) {
      const env = server.environments["rsc"];
      const runner = createServerModuleRunner(env);

      globalThis.__vite_rsc_runner = runner;
    },
    resolveId(id) {
      if (id === clientReferencesId) {
        return $clientReferencesId;
      }
    },
    load(id) {
      if (id === $clientReferencesId) {
        return [
          `export default {`,
          ...[...clientReferences.entries()].map(
            ([id, runtimeId]) => `"${runtimeId}": () => import("${id}"),\n`,
          ),
          `}`,
        ].join("\n");
      }
    },
    async transform(code, id) {
      if (this.environment.name === "rsc") {
        const runtimeId = clientReferences.get(id) ?? id;

        const context = {
          format: "module",
          url: runtimeId,
        };

        let { source } = await transformSource(
          code,
          context,
          (source: string) => ({ source }),
        );

        if (source.length !== code.length) {
          clientReferences.set(id, id);
        }

        if (
          this.environment.mode === "dev" ||
          __vite_rsc_manager.buildStep === "build"
        ) {
          return source;
        }
      }
    },
    generateBundle(_, output) {
      if (this.environment.name === "client") {
        const moduleIds = [...clientReferences.keys()];

        const references = Object.values(output).filter(
          (c) =>
            c.type === "chunk" &&
            c.facadeModuleId &&
            moduleIds.includes(c.facadeModuleId),
        ) as any[];

        for (const clientRef of references) {
          clientReferences.set(
            clientRef.facadeModuleId,
            `/${clientRef.fileName}`,
          );
        }

        console.log(clientReferences);
      }
    },
  };
}

function environment(options: ReactServerOptions): EnvironmentOptions {
  return {
    optimizeDeps: {
      include: [
        "osmos",
        "react",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "osmos > react-server-dom-esm/server",
        "osmos > react-server-dom-esm/server.node",
      ],
    },
    resolve: {
      conditions: ["module", "react-server"],
      noExternal: true,
    },
    build: {
      outDir: options.outDir,
      sourcemap: false,
      ssr: true,
      emitAssets: true,
      manifest: true,
      rollupOptions: {
        input: {
          index: options.entry,
        },
      },
    },
  };
}
export function hashString(v: string) {
  return createHash("sha256").update(v).digest().toString("hex");
}

type PluginStateManager = {
  buildStep: "build" | "scan";
};

globalThis.__vite_rsc_manager = {
  buildStep: "scan",
};

declare global {
  var __vite_rsc_runner: ModuleRunner;
  var __vite_rsc_manager: PluginStateManager;
}
