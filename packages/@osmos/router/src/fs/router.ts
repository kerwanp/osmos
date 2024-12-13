import type { LayoutRoute, Route } from "../types";
import { posix } from "node:path";
import fg from "fast-glob";
import { toPath, analyzeModule } from "./utils";
import consola from "consola";
import { globby } from "globby";
import mm from "micromatch";

export type RouterConfig = {
  dir: string;
  extensions: string[];
};

export const glob = (path: string) => fg.sync(path, { absolute: true });

type RoutePath = ReturnType<typeof toPath> & {};

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

  #routeNode(path: string, routes: Route[]): Route[] {
    const node = routes.find(
      (r) => r.type === "layout" && path.startsWith(r.path),
    ) as LayoutRoute | undefined;

    if (node) {
      const deeper = this.#routeNode(path, node.children);
      return deeper ?? node.children;
    }

    return routes;
  }

  async addRoute(src: string) {
    const routePath = toPath(src, this.#config.dir);

    if (!routePath) return;

    const [_, exports] = analyzeModule(src);

    if (!exports.find((e) => e.n === "default")) {
      consola.warn(`The file "${src}" does not have a default export`);
      return;
    }

    if (routePath.type === "layout") {
      this.#addLayout(routePath);
    }

    if (routePath.type === "page") {
      this.#addPage(routePath);
    }
  }

  async removeRoute(src: string) {
    const routePath = toPath(src, this.#config.dir);

    if (!routePath) return;

    if (routePath.type === "page") {
      this.#removePage(routePath);
    }

    if (routePath.type === "layout") {
      this.#removeLayout(routePath);
    }
  }

  isRoute(src: string): boolean {
    return mm.isMatch(src, this.glob());
  }

  async updateRoute(src: string) {
    if (!this.isRoute(src)) return;

    this.dispatchEvent(new CustomEvent("reload"));
  }

  async #removePage(path: RoutePath) {
    const node = this.#routeNode(path.path, this.#routes);
    const i = node.findIndex((route) => route.path === path.path);

    if (i >= 0) {
      node.splice(i, 1);
    }

    this.dispatchEvent(new CustomEvent("reload"));
  }

  async #removeLayout(path: RoutePath) {
    const node = this.#routeNode(path.path, this.#routes);
    console.log("NODE", node);
  }

  async #addLayout(path: RoutePath) {
    const node = this.#routeNode(path.path, this.#routes);

    node.push({
      type: "layout",
      path: path.path,
      source: path.source,
      children: [],
    });

    this.dispatchEvent(new CustomEvent("reload"));
  }

  async #addPage(path: RoutePath) {
    const node = this.#routeNode(path.path, this.#routes);

    node.push({
      type: "page",
      path: path.path,
      source: path.source,
    });

    this.dispatchEvent(new CustomEvent("reload"));
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
