"use client";

import { MYSYMBOL, useTest } from "@/providers/test.provider";
import { Hello } from "./hello";

export default function Page({ symbol }) {
  const test = useTest();
  console.log(test);
  console.log(symbol === MYSYMBOL);
  return <Hello />;
}
