import Link from "@osmosjs/osmos/link";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold">Users</h1>
      <div className="flex gap-3 mb-4">
        <Link
          href="/users"
          className="bg-purple-600 text-white py-1 px-3 rounded-md"
        >
          Users
        </Link>
        <Link
          href="/users/create"
          className="bg-purple-600 text-white py-1 px-3 rounded-md"
        >
          Create
        </Link>
      </div>
      <div>{children}</div>
    </div>
  );
}
