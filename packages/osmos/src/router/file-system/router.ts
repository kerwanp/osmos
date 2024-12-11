import { posix } from "node:path";
import fg from "fast-glob";
import { toPath, analyzeModule } from "./utils";
import consola from "consola";
import { LayoutRoute, Route } from "../types";

export type RouterConfig = {
  dir: string;
  extensions: string[];
};

export const glob = (path: string) => fg.sync(path, { absolute: true });

type RoutePath = ReturnType<typeof toPath> & {};

export class FileSystemRouter {
  #routes: Route[] = [];
  #config: RouterConfig;
  #compiled = false;

  constructor(config: RouterConfig) {
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

    // const type = routePath.type as RouteType;
    // const path = routePath.path;
    //
    // const node = this.#routeNode(path);
    //
    // (node ?? this.#routes).push(
    //   type === "layout"
    //     ? {
    //         type: "layout",
    //         path: path,
    //         source: src,
    //         children: [],
    //       }
    //     : {
    //         type: "page",
    //         path,
    //         source: src,
    //       },
    // );
  }

  async #addLayout(path: RoutePath) {
    const node = this.#routeNode(path.path, this.#routes);

    node.push({
      type: "layout",
      path: path.path,
      source: path.source,
      children: [],
    });
  }

  async #addPage(path: RoutePath) {
    const node = this.#routeNode(path.path, this.#routes);

    node.push({
      type: "page",
      path: path.path,
      source: path.source,
    });
  }

  async compile() {
    this.#compiled = true;
    for (const src of glob(this.glob())) {
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
