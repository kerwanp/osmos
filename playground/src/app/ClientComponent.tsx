"use client";

import { useState } from "react";

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((i) => i + 1)}>Click {count}</button>;
}
