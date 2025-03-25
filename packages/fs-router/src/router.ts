import { Hookable } from "hookable";
import { removeFile, updateFile } from "./routes";
import { FilesOptions } from "./types";
import {
  createRouter,
  exportMatcher,
  MatcherExport,
  toRouteMatcher,
} from "radix3";
import { scanDir } from "./utils/scanDir";

export type FileSystemRouterOptions<T extends FilesOptions> = {
  dir: string;
  files: T;
  extensions: string[];
};

export type FileSystemRouterHooks = {
  reload: () => void | Promise<void>;
};

export class FileSystemRouter<
  T extends FilesOptions,
> extends Hookable<FileSystemRouterHooks> {
  protected options: FileSystemRouterOptions<T>;
  protected compiled = false;
  protected router = createRouter();

  constructor(options: FileSystemRouterOptions<T>) {
    super();
    this.options = options;
  }

  addFile(file: string) {
    updateFile(file, {
      router: this.router,
      base: this.options.dir,
      files: this.options.files,
    });
  }

  updateFile(file: string) {
    updateFile(file, {
      router: this.router,
      base: this.options.dir,
      files: this.options.files,
    });
  }

  removeFile(file: string) {
    removeFile(file, {
      router: this.router,
      base: this.options.dir,
      files: this.options.files,
    });
  }

  async compile() {
    const files = await scanDir({
      dir: this.options.dir,
      extensions: this.options.extensions,
      files: Object.keys(this.options.files),
    });

    for (const file of files) {
      this.addFile(file);
    }

    this.compiled = true;
  }

  async toJSON(): Promise<MatcherExport> {
    if (!this.compiled) {
      await this.compile();
    }

    return exportMatcher(toRouteMatcher(this.router));
  }

  async getRoutes(): Promise<MatcherExport> {
    if (!this.compiled) {
      await this.compile();
    }

    return exportMatcher(toRouteMatcher(this.router));
  }
}
