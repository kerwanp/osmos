import { EnvironmentOptions, PluginOption } from "vite";
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
      }
    },
  };
}

function environment(options: ReactServerOptions): EnvironmentOptions {
  return {
    optimizeDeps: {
      include: [
        "react",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@osmosjs/osmos > react-server-dom-esm/server",
        "@osmosjs/osmos > react-server-dom-esm/server.node",
        "unified", // TODO: Remove this after fixing cjs imports
      ],
      esbuildOptions: {
        target: "esnext",
      },
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
      target: "esnext",
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
