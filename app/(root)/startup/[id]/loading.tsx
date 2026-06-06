import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you are using shadcn or a custom Skeleton component
import RecentStartupsSkeleton from "@/components/RecentStartupsSkeleton";

export default function Loading() {
  return (
    <main className="w-full">
      {/* 1. Hero Section Skeleton */}
      <section className="hero_container !min-h-[230px]">
        {/* Using a subtle white/20 pulse to match the dark red background */}
        <Skeleton className="w-40 h-14 rounded-md bg-white/20 mb-4" />
        <Skeleton className="w-3/4 max-w-3xl h-28 bg-white/20 rounded-xl mb-5" />
        <Skeleton className="w-1/2 max-w-2xl h-12 bg-white/20 rounded-md" />
      </section>

      {/* 2. Main Content Area */}
      <div className="w-full bg-white-100 min-h-screen">
        <section className="section_container">
          
          {/* Main Image Skeleton */}
          <Skeleton className="w-full max-w-4xl mx-auto h-[400px] rounded-xl bg-black/5" />

          <div className="max-w-4xl mx-auto mt-12">
            
            {/* Meta Bar Skeleton */}
            <div className="flex-between gap-5 py-4 pl-4 pr-6 rounded-l-full bg-gradient-to-r from-primary/5 to-transparent mt-8">
              <div className="flex gap-3 items-center">
                <Skeleton className="w-16 h-16 rounded-full bg-black/10" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-32 h-6 bg-black/10 rounded-md" />
                  <Skeleton className="w-24 h-4 bg-black/10 rounded-md" />
                </div>
              </div>
              <Skeleton className="w-20 h-8 rounded-full bg-black/10" />
            </div>

            <hr className="divider" />

            {/* Pitch Details Skeleton */}
            <div className="mt-10">
              <Skeleton className="w-48 h-10 bg-black/10 rounded-md mb-6" />
              
              {/* Prose Skeleton Area matching the gradient background */}
              <div className="bg-gradient-to-br from-primary/5 to-transparent px-10 py-10 rounded-2xl flex flex-col gap-4">
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