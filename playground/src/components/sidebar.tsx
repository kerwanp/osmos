import Link from "@osmosjs/osmos/link";

export const Sidebar = () => {
  return (
    <div className="w-[350px] h-screen bg-slate-800 text-white px-4 py-12 flex flex-col gap-3">
      <Link href="/" className="text-md bg-white/10 py-2 px-4 rounded-md">
        Home
      </Link>
      <Link href="/users" className="text-md bg-white/10 py-2 px-4 rounded-md">
        Users
      </Link>
    </div>
  );
};
