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
          {/* We map 3 dummy items to fill the viewport while loading */}
          {[1, 2, 3, 4].map((index) => (
            <li
              key={index}
              /* Matched the exact widths from the RecentStartups cards */
              className="snap-center min-w-[260px] md:min-w-[300px]"
            >
              {/* Reusing your existing global skeleton class */}
              <div className="startup-card_skeleton"></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}