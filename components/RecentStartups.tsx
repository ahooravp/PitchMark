"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { getRecentStartupsData } from "@/lib/actions";
import RecentStartupsSkeleton from "./RecentStartupsSkeleton";

export default function RecentStartups({ currentId }: { currentId: string }) {
  const [startups, setStartups] = useState<StartupTypeCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const stored = localStorage.getItem("recent_startup_ids");
      if (!stored) {
        setIsLoading(false);
        return;
      }

      let ids: string[] = JSON.parse(stored);

      // Filter out the startup we are currently looking at
      ids = ids.filter((id) => id !== currentId);

      if (ids.length === 0) {
        setIsLoading(false);
        return;
      }

      // Fetch the full data objects securely from Sanity
      const fullStartupData = await getRecentStartupsData(ids);

      // Map them back into the exact order of the user's recent history
      const sortedStartups = ids
        .map((id) =>
          fullStartupData.find(
            (startup: StartupTypeCard) => startup._id === id,
          ),
        )
        .filter(Boolean) as StartupTypeCard[];

      setStartups(sortedStartups);
      setIsLoading(false);
    };

    fetchHistory();
  }, [currentId]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // 1. Show the skeleton while fetching the data from Sanity
  if (isLoading) return <RecentStartupsSkeleton />;

  // 2. Hide the section completely if there is no history to show
  if (startups.length === 0) return null;

  return (
    <section className="w-full mt-16 pt-8 border-t border-black/5">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-primary font-bold tracking-widest text-[12px] uppercase mb-1 block">
            History
          </span>
          <h2 className="text-26-semibold text-black-200">Recently Viewed</h2>
        </div>
      </div>

      {/* The Carousel */}
      <div className="relative group mt-4">
        {/* Left Navigation Arrow */}
        <button
          onClick={() => scroll("left")}
          // CRITICAL FIX: Removed lg:hidden and lg:group-hover:flex. Upgraded hover states.
          className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 z-10 flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-md border-2 border-black/5 rounded-full shadow-md active:bg-primary active:text-white [@media(hover:hover)]:hover:bg-primary [@media(hover:hover)]:hover:text-white transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <ul
          ref={scrollRef}
          className="card_grid-sm-editor relative w-full hide-scrollbar"
        >
          {startups.map((post: StartupTypeCard, i: number) => (
            <li
              key={i}
              className="snap-center flex flex-col w-[260px] sm:w-[280px] md:w-[300px] shrink-0 [&>*]:w-full [&>*]:max-w-full"
            >
              <StartupCard post={post} variant="compact" />
            </li>
          ))}
        </ul>

        {/* Right Navigation Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-4 z-10 flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-md border-2 border-black/5 rounded-full shadow-md active:bg-primary active:text-white [@media(hover:hover)]:hover:bg-primary [@media(hover:hover)]:hover:text-white transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
