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
    // Inside the return statement
    <div className="relative group mt-4">
      {/* Left Navigation Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 z-10 flex lg:hidden lg:group-hover:flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-md border-2 border-black/5 rounded-full shadow-md active:bg-primary active:text-white lg:hover:bg-primary lg:hover:text-white transition-all"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* The Scrolling Container */}
      <ul
        ref={scrollRef}
        // Removed px-6 to allow true edge-to-edge scroll calculation
        className="card_grid-sm-editor relative w-full md:px-0"
      >
        {/* Left breathing room injected as a physical item */}
        <div className="w-6 shrink-0 md:hidden" aria-hidden="true" />

        {editorPosts.map((post: StartupTypeCard, i: number) => (
          <li
            key={i}
            className="snap-center flex flex-col w-[280px] sm:w-[300px] md:w-[320px] shrink-0 [&>*]:w-full [&>*]:max-w-full"
          >
            <StartupCard post={post} variant="compact" />
          </li>
        ))}

        {/* Right breathing room injected as a physical item */}
        <div className="w-6 shrink-0 md:hidden" aria-hidden="true" />
      </ul>

      {/* Right Navigation Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-4 z-10 flex lg:hidden lg:group-hover:flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-md border-2 border-black/5 rounded-full shadow-md active:bg-primary active:text-white lg:hover:bg-primary lg:hover:text-white transition-all"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
