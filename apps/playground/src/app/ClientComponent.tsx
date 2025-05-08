"use client";

import { TestProvider } from "@/providers/test.provider";
import { useState } from "react";

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((i) => i + 1)}>Click {count}</button>;
}

export const SecondClientComponent = () => {
  return <div>CLIENT COMP</div>;
};
