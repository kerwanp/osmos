export const $global = {
  clientReferences: new Map<
    string,
    {
      hash: string;
      referenceId?: string;
      fileName?: string;
    }
  >(),
};
