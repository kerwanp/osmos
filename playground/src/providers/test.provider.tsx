"use client";

import { createContext, PropsWithChildren, useContext } from "react";

const Context = createContext<string | null>(null);

export const TestProvider = ({ children }: PropsWithChildren) => {
  return <Context.Provider value={"TESTEST"}>{children}</Context.Provider>;
};

export function useTest() {
  const context = useContext(Context);
  return context;
}
