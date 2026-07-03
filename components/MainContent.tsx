import { Suspense } from "react";
import { StartupCardSkeleton } from "@/components/StartupCard";
import EditorPicksSkeleton from "@/components/EditorPicksSkeleton";
import StartupList from "@/components/StartupList";
import EditorPicks from "@/components/EditorPicks";

// 1. Accept the Promise, not the string
export default async function MainContent({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  // 2. Await the runtime data safely inside this component
  const { query } = await searchParams;

  return (
    <>
      {/* Editor Picks only show when not searching */}
      {!query && (
        <Suspense fallback={<EditorPicksSkeleton />}>
          <EditorPicks />
        </Suspense>
      )}

      {/* Main Discover/Search Section */}
      <section className="px-6 pt-10 pb-16 max-w-7xl mx-auto wide:max-w-10xl">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-black-300 font-bold tracking-widest text-[12px] uppercase mb-1 block">
              {query ? "Results" : "Discover"}
            </span>
            <h2 className="text-30-semibold text-black-200">
              {query ? `Search: "${query}"` : "The Latest Startups"}
            </h2>
          </div>
        </div>

        <Suspense
          key={query}
          fallback={
            <ul className="mt-5 card_grid">
              <StartupCardSkeleton />
            </ul>
          }
        >
          <StartupList query={query} />
        </Suspense>
      </section>
    </>
  );
}