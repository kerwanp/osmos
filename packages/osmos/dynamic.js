"use client";

import { lazy } from "react";

export default function dynamic(cb) {
  return lazy(cb);
}
