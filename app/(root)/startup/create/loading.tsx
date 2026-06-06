import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="w-full">
      {/* Renders the hero instantly so the user doesn't see a blank screen */}
      <section className="hero_container !min-h-[230px]">
        <h1 className="heading">Submit Your Startup</h1>
      </section>

      {/* A skeleton placeholder matching the layout of your StartupForm */}
      <div className="max-w-2xl mx-auto p-12 my-16">
        <div className="flex flex-col gap-8">
          <Skeleton className="w-full h-12 rounded-md bg-black/5" />
          <Skeleton className="w-full h-12 rounded-md bg-black/5" />
          <Skeleton className="w-full h-40 rounded-md bg-black/5" />
          <Skeleton className="w-full h-16 rounded-full bg-black/10 mt-8" />
        </div>
      </div>
    </main>
  );
}