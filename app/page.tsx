import { Suspense } from "react";
import SearchForm, { SearchFormSkeleton } from "@/components/SearchForm";
import MainContent from "@/components/MainContent";
import { SanityLive } from "@/sanity/lib/live";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  return (
    <>
      <section className="hero_container">
        <h1 className="heading">
          Pitch Your Startup, <br />
          Connect with Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and get Noticed in Virtual Competition
        </p>

        {/* Look how clean this is now! */}
        <Suspense fallback={<SearchFormSkeleton />}>
          <SearchForm searchParams={searchParams} />
        </Suspense>
      </section>

      <Suspense>
        <MainContent searchParams={searchParams} />
      </Suspense>

      <SanityLive />
    </>
  );
}