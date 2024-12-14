import type { Route } from "../types";
import { posix } from "node:path";
import fg from "fast-glob";
import { toRoute, analyzeModule } from "./utils";
import consola from "consola";
import { globby } from "globby";
import mm from "micromatch";

export type RouterConfig = {
  dir: string;
  extensions: string[];
};

export const glob = (path: string) => fg.sync(path, { absolute: true });

/**
 * TODO: We might want to construct the tree ahead of time and not on the fly for performance reasons
 */
export class FileSystemRouter extends EventTarget {
  #routes: Route[] = [];
  #config: RouterConfig;
  #compiled = false;

  constructor(config: RouterConfig) {
    super();
    this.#config = config;
  }

  glob() {
    return (
      posix.join(
        fg.convertPathToPattern(this.#config.dir),
        "**/{layout,page}",
      ) + `.{${this.#config.extensions.join(",")}}`
    );
  }

  async addRoute(src: string) {
    const route = toRoute(src, this.#config.dir, ["page", "layout"]);

    if (!route) return;

    const [_, exports] = analyzeModule(src);

    if (!exports.find((e) => e.n === "default")) {
      consola.warn(`The file "${src}" does not have a default export`);
      return;
    }

    this.#routes.push(route);
    this.dispatchEvent(new CustomEvent("reload"));
    return true;
  }

  removeRoute(src: string) {
    const existing = this.#routes.findIndex((r) => r.source === src);
    if (existing < 0) return;
    this.#routes.splice(existing, 1);
    this.dispatchEvent(new CustomEvent("reload"));
    return true;
  }

  isRoute(src: string): boolean {
    return mm.isMatch(src, this.glob());
  }

  async updateRoute(src: string) {
    if (!this.#routes.find((r) => r.source === src)) return;
    this.dispatchEvent(new CustomEvent("reload"));
    return true;
  }

  async compile() {
    this.#compiled = true;
    for (const src of await scanDir(
      this.#config.dir,
      this.#config.extensions,
    )) {
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

export function createFileSystemRouter(config: RouterConfig) {
  return new FileSystemRouter(config);
}

export function scanDir(dir: string | URL, extensions: string[]) {
  return globby(".", {
    cwd: dir,
    absolute: true,
    expandDirectories: {
      files: ["layout", "page"],
      extensions,
    },
  });
}
