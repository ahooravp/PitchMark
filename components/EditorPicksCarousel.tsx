"use client";

import { useRef } from "react";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function EditorPicksCarousel({
  editorPosts,
}: {
  editorPosts: StartupTypeCard[];
}) {
  const scrollRef = useRef<HTMLUListElement>(null);

  // This function physically scrolls the container by 400 pixels left or right
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group mt-4">
      {/* Left Navigation Arrow */}
      {/* Left Navigation Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden group-hover:flex items-center justify-center w-10 h-10 bg-white border-2 border-black/5 rounded-full shadow-md hover:bg-primary hover:text-white transition-all"
        aria-label="Scroll left"
      >
        {/* The Lucide Icon! */}
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* The Scrolling Container */}
      <ul ref={scrollRef} className="card_grid-sm-editor relative w-full">
        {editorPosts.map((post: StartupTypeCard, i: number) => (
          // Important: We add a wrapper to define the width of each card and snap alignment
          <li key={i} className="snap-center min-w-[260px] md:min-w-[300px]">
            <StartupCard post={post} variant="compact" />
          </li>
        ))}
      </ul>

      {/* Right Navigation Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden group-hover:flex items-center justify-center w-10 h-10 bg-white border-2 border-black/5 rounded-full shadow-md hover:bg-primary hover:text-white transition-all"
        aria-label="Scroll right"
      >
        {/* The Lucide Icon! */}
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
