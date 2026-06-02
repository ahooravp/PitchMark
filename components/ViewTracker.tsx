"use client";

import { useEffect } from "react";
import { saveRecentStartupId } from "@/lib/recent-startups";

export default function ViewTracker({ id }: { id: string }) {
  useEffect(() => {
    saveRecentStartupId(id);
  }, [id]);

  return null;
}