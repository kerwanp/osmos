"use client";

import { useTest } from "@/providers/test.provider";

export const TestComponent = () => {
  const test = useTest();
  console.log("IT WORKS?", test);
  return null;
};
