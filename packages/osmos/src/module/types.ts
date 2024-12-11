import { Promisable } from "type-fest";
import { OsmosApp } from "../core/app";
import { Consola } from "consola";

export type ModuleDefinition = {
  name: string;
  setup(app: OsmosApp, logger: Consola): Promisable<void>;
};
