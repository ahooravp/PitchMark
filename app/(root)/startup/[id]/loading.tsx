import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import RecentStartupsSkeleton from "@/components/RecentStartupsSkeleton";

export default function Loading() {
  return (
    <main className="w-full">
      {/* 1. Hero Section Skeleton */}
      <section className="hero_container !min-h-[230px]">
        {/* Using a subtle white/20 pulse to match the dark primary background */}
        <Skeleton className="w-40 h-14 rounded-md bg-white/20 mb-4" />
        <Skeleton className="w-3/4 max-w-3xl h-28 bg-white/20 rounded-xl mb-5" />
        <Skeleton className="w-1/2 max-w-2xl h-12 bg-white/20 rounded-md" />
      </section>

      {/* 2. Main Content Area */}
      <div className="w-full bg-white-100 min-h-screen">
        <section className="section_container">
          {/* Main Image Skeleton */}
          <Skeleton className="w-full max-w-4xl mx-auto h-[200px] sm:h-[400px] rounded-xl bg-black/5" />

          <div className="max-w-4xl mx-auto mt-8 sm:mt-12">
            {/* Meta Bar Skeleton */}
            <div className="flex flex-row justify-between items-center gap-3 py-4 px-5 sm:pl-4 sm:pr-6 rounded-2xl sm:rounded-l-full sm:rounded-r-none bg-gradient-to-br sm:bg-gradient-to-r from-primary/5 to-transparent mt-6 sm:mt-8">
              <div className="flex gap-3 items-center min-w-0">
                {/* CRITICAL FIX: Matched the w-12 h-12 mobile avatar scaling */}
                <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/10 shrink-0" />
                <div className="flex flex-col gap-2 min-w-0">
                  <Skeleton className="w-24 sm:w-32 h-5 sm:h-6 bg-black/10 rounded-md" />
                  <Skeleton className="w-16 sm:w-24 h-3 sm:h-4 bg-black/10 rounded-md" />
                </div>
              </div>
              {/* CRITICAL FIX: shrink-0 on the tag skeleton */}
              <Skeleton className="w-16 sm:w-20 h-7 sm:h-8 rounded-full bg-black/10 shrink-0" />
            </div>

            <hr className="divider" />

            {/* Pitch Details Skeleton */}
            <div className="mt-8 sm:mt-10">
              <Skeleton className="w-48 h-10 bg-black/10 rounded-md mb-6" />

              {/* Prose Skeleton Area matching the gradient background */}
              <div className="bg-gradient-to-br from-primary/5 to-transparent px-5 py-6 sm:px-10 sm:py-10 rounded-2xl flex flex-col gap-4">
                <Skeleton className="w-full h-4 bg-black/10 rounded-sm" />
                <Skeleton className="w-full h-4 bg-black/10 rounded-sm" />
                <Skeleton className="w-5/6 h-4 bg-black/10 rounded-sm" />

                {/* Adding a visual break to simulate paragraphs */}
                <Skeleton className="w-full h-4 bg-black/10 rounded-sm mt-4" />
                <Skeleton className="w-4/5 h-4 bg-black/10 rounded-sm" />
                <Skeleton className="w-[90%] h-4 bg-black/10 rounded-sm" />
              </div>
            </div>
          </div>

          <RecentStartupsSkeleton />
        </section>
      </div>
    </main>
  );
}
