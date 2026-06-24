import React from "react";

export default function EditorPicksSkeleton() {
  return (
    <section className="w-full bg-primary/5 border-b border-black/5 py-7">
      
      {/* 1. Header Wrapper: Matches the exact max-w and top margin of the live UI */}
      <div className="max-w-7xl mx-auto px-6 mt-3">
        <div className="flex justify-between items-end">
          <div>
            {/* 'Featured' Eyebrow */}
            <div className="w-16 h-3 bg-black/10 rounded mb-2 animate-pulse"></div>
            {/* Main Title */}
            <div className="w-48 h-7 bg-black/10 rounded animate-pulse"></div>
          </div>
          {/* 'View Collection' Button */}
          <div className="hidden sm:block w-32 h-4 bg-black/10 rounded animate-pulse mb-1"></div>
        </div>
      </div>

      {/* 2. Carousel Wrapper: Matches the exact max-w of the live UI */}
      <div className="max-w-7.5xl mx-auto px-6">
        
        {/* Matches the 'relative group mt-4' from EditorPicksCarousel.tsx */}
        <div className="relative group mt-4">
          
          <ul className="card_grid-sm-editor relative w-full overflow-hidden flex gap-5">
            {[1, 2, 3, 4].map((index) => (
              <li
                key={index}
                // CRITICAL FIX: These dimensions now exactly match EditorPicksCarousel.tsx
                className="snap-center min-w-[260px] md:min-w-[300px]"
              >

                <div className="startup-card_skeleton !w-[300px] !h-[400px]"></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}