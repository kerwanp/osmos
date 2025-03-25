"use client";

export function usePathname() {
  return "/docs/introduction";
}

export function useRouter() {
  return {};
}

export function notFound() {
  throw new Error("Not found");
}
