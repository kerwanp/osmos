import { $logger } from "./logger";
import { copy } from "./utils/copy";
import { fileURLToPath } from "url";
import { readPackageJSON, writePackageJSON } from "pkg-types";
import { join } from "pathe";
import { installDependencies } from "nypm";
import { getPkgManager } from "./utils/pkg-manager";

export type CreateProjectOptions = {
  path: string;
  projectName: string;
  eslint: boolean;
  tailwind: boolean;
  template: string;
};

export async function createProject(options: CreateProjectOptions) {
  await installTemplate(options);
}

async function installTemplate(options: CreateProjectOptions) {
  $logger.info(`Installing application template '${options.template}'...`);

  const templatePath = fileURLToPath(
    new URL(`../templates/${options.template}`, import.meta.url),
  );

  await copy({
    src: templatePath,
    target: options.path,
    patterns: ["**"],
  });

  const pkg = await readPackageJSON(templatePath);
  pkg.name = options.projectName;

  pkg.scripts = {
    prepare: "osmos prepare",
    dev: "osmos dev",
    build: "osmos build",
  };

  pkg.devDependencies = {
    ...pkg.devDependencies,
    typescript: "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
  };

  pkg.dependencies = {
    ...pkg.dependencies,
    "@osmosjs/osmos": "latest", // TODO: Fix version instead
    react: "^19",
    "react-dom": "^19",
  };

  await writePackageJSON(join(options.path, "package.json"), pkg);

  $logger.info(`Installing dependencies`);
  await installDependencies({
    packageManager: getPkgManager(),
    cwd: options.path,
  });
}
