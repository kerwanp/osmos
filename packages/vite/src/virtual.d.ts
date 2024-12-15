import { ModuleRunner } from "vite/module-runner";

// TODO: We might want to improve types here
declare module "virtual:react-server:manifest" {
  const data: Record<
    string,
    { import: () => Promise<any>; clientAsset: string }
  >;
  export default data;
}

declare module "virtual:react-server:assets" {
  const data: (
    id: string,
  ) => Record<string, { import: () => Promise<any>; clientAsset: string }>;
  export default data;
}

declare global {
  var __vite_rsc_runner: ModuleRunner;
}
