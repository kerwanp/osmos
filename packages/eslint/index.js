import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";
import stylistic from "@stylistic/eslint-plugin-ts";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const plugins = {
  "@unicorn": unicorn,
  "@stylistic": stylistic,
  ...eslintPluginPrettierRecommended.plugins,
};

/**
 * Configures ESLint to use an opinionated config tailored for
 * creating a TypeScript library.
 *
 * You may pass additional config blocks as multiple
 * arguments to this function.
 *
 * @example
 * ```js
 * configPkg()
 *
 * configPkg({
 *   files: INCLUDE_LIST,
 *   ignore: IGNORE_LIST,
 *   rules: {
 *   }
 * })
 * ```
 *
 * @param {import('typescript-eslint').ConfigWithExtends[]} configBlocksToMerge
 */
export function configPackage(...configBlocksToMerge) {
  return tseslint.config(
    tseslint.configs.base,
    {
      name: "plugins",
      plugins,
    },
    ...configBlocksToMerge,
  );
}
