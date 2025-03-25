"use client";

import { useTest } from "@/providers/test.provider";

export default function Page() {
  const test = useTest();

  console.log(test);

  return (
    <div>
      <h2 className="text-xl">Create User</h2>
    </div>
  );
}
