import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Skeleton className="w-full h-[230px] rounded-xl" />
      <div className="mt-10 max-w-4xl mx-auto w-full space-y-5">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-40" />
      </div>
    </div>
  );
}