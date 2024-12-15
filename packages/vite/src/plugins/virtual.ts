import { PluginOption } from "vite";

export type VirtualPluginOptions = {
  id: string;
  environments?: string[];
  mode?: "dev" | "build";
  load: () => Promise<string> | string;
};

export default function virtual(options: VirtualPluginOptions): PluginOption {
  const virtualId = options.id;
  const $virtualId = `\0${virtualId}`;

  return {
    name: "osmos:virtual",
    resolveId(id) {
      if (id === virtualId) {
        return $virtualId;
      }
    },
    applyToEnvironment(env) {
      if (options.environments) {
        return options.environments.includes(env.name);
      }
    },
    apply(_config, env) {
      if (options.mode) {
        return options.mode === env.mode;
      }

      return true;
    },
    async load() {
      if (virtualId === $virtualId) {
        return options.load();
      }
    },
  };
}
