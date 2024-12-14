import { defineCommand } from "citty";
import { $logger } from "./logger";
import { createProject } from "./project";
import { basename, join, resolve } from "pathe";
import { stat } from "fs/promises";

async function askProjectName(cwd: string) {
  const value = await $logger.prompt(
    "Where should we create your new project?",
    {
      placeholder: "./future-unicorn",
      required: true,
    },
  );

  if (value === undefined) {
    return askProjectName(cwd);
  }

  // Cancelled
  if (typeof value !== "string") {
    process.exit(1);
  }

  const path = join(cwd, value);

  if (
    await stat(path)
      .then(() => true)
      .catch(() => false)
  ) {
    $logger.error(`The directory '${path}' is not empty`);
    return askProjectName(cwd);
  }

  return {
    path,
    projectName: basename(path),
  };
}

async function askEslint() {
  const value = await $logger.prompt("Should we configure ESLint for you?", {
    type: "confirm",
  });

  // Cancelled
  if (typeof value !== "boolean") {
    process.exit(1);
  }

  return value;
}

async function askTailwind() {
  const value = await $logger.prompt("What about TailwindCSS?", {
    type: "confirm",
  });

  // Cancelled
  if (typeof value !== "boolean") {
    process.exit(1);
  }

  return value;
}

export default defineCommand({
  meta: {
    name: "create-osmos",
  },
  args: {
    cwd: {
      type: "string",
      description: "Specify the working directory",
      valueHint: "directory",
      default: ".",
    },
  },
  async run({ args }) {
    const cwd = resolve(args.cwd);
    const { path, projectName } = await askProjectName(cwd);
    const eslint = await askEslint();
    const tailwind = await askTailwind();

    await createProject({
      path,
      projectName,
      eslint,
      tailwind,
      template: "app",
    });
  },
});
