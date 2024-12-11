import { resolve } from "pathe";
import { findWorkspaceDir } from "pkg-types";
import { defineUntypedSchema } from "untyped";
import { isDebug, isDevelopment, isTest } from "std-env";
import app from "./app";

export default defineUntypedSchema({
  ...app,
  rootDir: {
    $resolve: (val) => (typeof val === "string" ? resolve(val) : process.cwd()),
  },

  appDir: {
    $resolve: async (val: string | undefined, get): Promise<string> => {
      const rootDir = (await get("rootDir")) as string;
      if (val) {
        return resolve(rootDir, val);
      }

      return resolve(rootDir, "src");
    },
  },

  workspaceDir: {
    $resolve: async (val: string | undefined, get): Promise<string> => {
      const rootDir = (await get("rootDir")) as string;
      return val
        ? resolve(rootDir, val)
        : await findWorkspaceDir(rootDir).catch(() => rootDir);
    },
  },

  buildDir: {
    $resolve: async (val: string | undefined, get) => {
      const rootDir = (await get("rootDir")) as string;
      return resolve(rootDir, val ?? ".osmos");
    },
  },

  modules: {
    $resolve: (val: any[] | undefined) => val ?? [],
  },

  extensions: {
    $resolve: (val: string[] | undefined): string[] =>
      ["js", "jsx", "ts", "tsx", ...(val ?? [])].filter(Boolean),
  },

  dev: Boolean(isDevelopment),

  test: Boolean(isTest),

  debug: {
    $resolve: (val) => val ?? isDebug,
  },

  logLevel: {
    $resolve: async (val: number, get): Promise<number> => {
      if (val) return val;
      const debug = (await get("debug")) as boolean;
      if (debug) return 4;
      return 3;
    },
  },
});