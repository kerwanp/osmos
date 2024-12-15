import type { Program } from "estree";
import esbuild from "esbuild";
import fs from "fs";
import { parse } from "es-module-lexer";
import { basename } from "path";

/**
 * Crawl ast to find directive.
 * @see https://github.com/hi-ogawa/vite-plugins/blob/cec21bc0ffe3f5a31170a663655699834cacd0d2/packages/transforms/src/utils.ts#L4
 */
export function hasDirective(
  body: Program["body"],
  directive: string,
): boolean {
  return !!body.find(
    (stmt) =>
      stmt.type === "ExpressionStatement" &&
      stmt.expression.type === "Literal" &&
      typeof stmt.expression.value === "string" &&
      stmt.expression.value === directive,
  );
}

/**
 * Transforms a react-server module into an intermediary one that uses server ModuleRunner.
 */
export function buildImportProxy(
  id: string,
  path: string,
  importExpression: string,
) {
  const [_, exports] = analyzeModule(id);

  const namedExports = exports.filter((e) => e.n !== "default");
  const hasDefaultExport = exports.filter((e) => e.n === "default");

  const code = [
    `const moduleId = '${path}'`,
    `const module = await ${importExpression}(moduleId /* @vite-ignore */)`,
    ...namedExports.map((e) => `export const ${e.n} = module.${e.n}`),
  ];

  if (hasDefaultExport) {
    code.push(`export default module.default`);
  }

  return code.join("\n");
}

export function analyzeModule(src: string) {
  return parse(
    esbuild.transformSync(fs.readFileSync(src, "utf-8"), {
      jsx: "transform",
      format: "esm",
      loader: "tsx",
    }).code,
    src,
  );
}

export function createEntryName(id: string) {
  const fileNameSegments = basename(id).split(".");
  return fileNameSegments.slice(0, fileNameSegments.length - 1).join(".");
}
