import { DevEnvironment, PluginOption, ViteDevServer } from "vite";

export type ServerCSSOptions = {
  serverEntry: string;
};

export function serverCss(options: ServerCSSOptions): PluginOption {
  const cssId = "virtual:server-css";
  const $cssId = "\0virtual:server-css";

  let viteDevServer: ViteDevServer;

  return [
    {
      name: "osmos:server:css",
      configureServer(server) {
        viteDevServer = server;
        // TODO: Invalidate https://github.com/hi-ogawa/vite-environment-examples/blob/f8624d7d64dbd5526e68baa4415253c0bdea0600/examples/react-server/src/features/style/plugin.ts#L24
      },
      transformIndexHtml: {
        handler: () => {
          return [
            // {
            //   tag: "link",
            //   injectTo: "head",
            //   attrs: {
            //     rel: "stylesheet",
            //     href: `/_osmos/@id/__x00__${cssId}`,
            //   },
            // },
            // TODO : https://github.com/hi-ogawa/vite-environment-examples/blob/f8624d7d64dbd5526e68baa4415253c0bdea0600/examples/react-server/src/features/style/plugin.ts#L45
          ];
        },
      },
      resolveId(id) {
        if (id === cssId) {
          return $cssId;
        }
      },
      async load(id) {
        if (id === $cssId) {
          // TODO: Generate from manifest during build
          const urls = await collectStyleUrls(
            viteDevServer.environments["rsc"],
            [options.serverEntry],
          );

          return [...urls.map((url) => `import '${url}'`)].join("\n");
        }
      },
    },
  ];
}

// cf. https://github.com/vitejs/vite/blob/d6bde8b03d433778aaed62afc2be0630c8131908/packages/vite/src/node/constants.ts#L49C23-L50
const CSS_LANGS_RE =
  /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;
async function collectStyleUrls(
  server: DevEnvironment,
  entries: string[],
): Promise<string[]> {
  const visited = new Set<string>();

  async function traverse(url: string) {
    const [, id] = await server.moduleGraph.resolveUrl(url);
    if (visited.has(id)) {
      return;
    }
    visited.add(id);
    const mod = server.moduleGraph.getModuleById(id);
    if (!mod) {
      return;
    }
    await Promise.all(
      [...mod.importedModules].map((childMod) => traverse(childMod.url)),
    );
  }

  // ensure vite's import analysis is ready _only_ for top entries to not go too aggresive
  await Promise.all(entries.map((e) => server.transformRequest(e)));

  // traverse
  await Promise.all(entries.map((url) => traverse(url)));

  // filter
  return [...visited].filter((url) => url.match(CSS_LANGS_RE));
}
