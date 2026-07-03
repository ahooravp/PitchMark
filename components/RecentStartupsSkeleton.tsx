import React from "react";

export default function RecentStartupsSkeleton() {
  return (
    <section className="w-full mt-16 pt-8 border-t border-black/5">
      {/* 1. Skeleton Header matching the "History / Recently Viewed" text footprint */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="w-16 h-3 bg-black/10 rounded mb-3 animate-pulse"></div>
          <div className="w-48 h-8 bg-black/10 rounded animate-pulse"></div>
        </div>
      </div>

      {/* 2. Skeleton Carousel mimicking the Editor Picks skeleton */}
      <div className="relative group mt-4">
        <ul className="card_grid-sm-editor relative w-full overflow-hidden hide-scrollbar">
          {[1, 2, 3, 4].map((index) => (
            <li
              key={index}
              className="snap-center flex flex-col w-[260px] sm:w-[280px] md:w-[300px] shrink-0 [&>*]:w-full [&>*]:max-w-full"
            >
              <div className="startup-card_skeleton w-full !h-[400px]"></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
