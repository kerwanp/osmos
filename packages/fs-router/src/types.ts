import { MatcherExport } from "radix3";

export type FilesOptions = Record<
  string,
  {
    verifier: () => boolean;
    isMiddleware?: boolean;
  }
>;

export type SerializedRouter = MatcherExport;
