import type { Route } from "../types";
import { posix } from "node:path";
import fg from "fast-glob";
import { toRoute, analyzeModule } from "./utils";
import consola from "consola";
import { globby } from "globby";
import mm from "micromatch";
import { Hookable } from "hookable";

export type RouterConfig = {
  dir: string;
  extensions: string[];
};

export const glob = (path: string) => fg.sync(path, { absolute: true });

export type FileSystemRouterHooks = {
  reload: () => void | Promise<void>;
};

/**
 * TODO: We might want to construct the tree ahead of time and not on the fly for performance reasons
 */
export class FileSystemRouter extends Hookable<FileSystemRouterHooks> {
  #routes: Route[] = [];
  #config: RouterConfig;
  #compiled = false;
  #comparator: RoutesComparator;

  constructor(config: RouterConfig) {
    super();
    this.#config = config;
    this.#comparator = createRoutesComparator({
      typesOrder: ["page", "layout"],
    });
  }

  glob() {
    return (
      posix.join(
        fg.convertPathToPattern(this.#config.dir),
        "**/{layout,page}",
      ) + `.{${this.#config.extensions.join(",")}}`
    );
  }

  addRoute(src: string) {
    const route = toRoute(src, this.#config.dir, ["page", "layout"]);

    if (!route) return;

    const [_, exports] = analyzeModule(src);

    if (!exports.find((e) => e.n === "default")) {
      consola.warn(`The file "${src}" does not have a default export`);
      return;
    }

    this.#routes.push(route);
    this.#routes.sort(this.#comparator);
    this.callHook("reload");
    return true;
  }

  removeRoute(src: string) {
    const existing = this.#routes.findIndex((r) => r.source === src);
    if (existing < 0) return;
    this.#routes.splice(existing, 1);
    this.callHook("reload");
    return true;
  }

  isRoute(src: string): boolean {
    return mm.isMatch(src, this.glob());
  }

  updateRoute(src: string) {
    if (!this.#routes.find((r) => r.source === src)) return;
    return true;
  }

  async compile() {
    this.#compiled = true;
    for (const src of await scanDir({
      dir: this.#config.dir,
      extensions: this.#config.extensions,
      files: ["layout", "page"],
    })) {
      await this.addRoute(src);
    }
  }

  async getRoutes() {
    if (!this.#compiled) {
      await this.compile();
    }

    return this.#routes;
  }
}

export function createFileSystemRouter(config: RouterConfig): FileSystemRouter {
  return new FileSystemRouter(config);
}

export type ScanDirOptions = {
  dir: string;
  extensions: string[];
  files: string[];
};

export async function scanDir({
  dir,
  files,
  extensions,
}: ScanDirOptions): Promise<string[]> {
  return globby(".", {
    cwd: dir,
    absolute: true,
    expandDirectories: {
      files: files,
      extensions: extensions,
    },
  });
}

export type ParsePathOptions = {
  filePath: string;
  dir: string;
};

export type ParsedPath = {
  src: string;
  path: string;
  type: string;
};

const PATH_RE = new RegExp(/(.*)\/(.*)\.(.*)/);
export function parseFilePath({
  filePath,
  dir,
}: ParsePathOptions): ParsedPath | null {
  const matches = filePath.slice(dir.length).match(PATH_RE);

  if (!matches) return null;

  const path = matches[1].length <= 0 ? "/" : matches[1];
  const type = matches[2];

  return {
    path,
    type,
    src: filePath,
  };
}

export type RoutesComparatorOptions = {
  typesOrder: string[];
};

export type RoutesComparator = (a: Route, b: Route) => number;

export function createRoutesComparator(options: RoutesComparatorOptions) {
  const typesOrder = options.typesOrder.reverse();
  function segmentsComparator(a: string, b: string): number {
    const al = a.split("/").length;
    const bl = b.split("/").length;
    if (al > bl) return 1;
    if (al < bl) return -1;
    return 0;
  }

  function powerComparator(a: number, b: number): number {
    if (a > b) return -1;
    if (a < b) return 1;
    return 0;
  }

  function typesComparator(a: string, b: string): number {
    const ai = typesOrder.indexOf(a);
    const bi = typesOrder.indexOf(b);

    if (ai > bi) return 1;
    if (ai < bi) return -1;
    return 0;
  }

  return (a: Route, b: Route) => {
    // Nesting level
    const segmentsScore = segmentsComparator(a.path, b.path);
    if (segmentsScore !== 0) {
      return segmentsScore;
    }

    const powerScore = powerComparator(a.power, b.power);
    if (powerScore !== 0) {
      return powerScore;
    }

    const typeScore = typesComparator(a.type, b.type);
    if (typeScore !== 0) {
      return typeScore;
    }

    return 0;
  };
}
