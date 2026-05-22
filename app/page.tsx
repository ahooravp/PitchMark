import { Suspense } from "react";
import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { PLAYLIST_BY_SLUG_QUERY, STARTUPS_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import EditorPicksCarousel from "@/components/EditorPicksCarousel";
// Existing StartupList component (no changes needed)
async function StartupList({ query }: { query?: string }) {
  const params = { search: query || null };

  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  return (
    <ul className="mt-5 card_grid">
      {posts?.length > 0 ? (
        posts.map((post: StartupTypeCard) => (
          <StartupCard key={post?._id} post={post} />
        ))
      ) : (
        <p className="text-20-regular">No startups found.</p>
      )}
    </ul>
  );
}

// 🆕 Component that awaits searchParams – wrapped in Suspense below
async function HomeContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ query?: string }>;
}) {
  const { query } = await searchParamsPromise; // ✅ await happens inside Suspense
  const { select: editorPosts } = await client.fetch(PLAYLIST_BY_SLUG_QUERY, {
    slug: "editor-picks",
  });

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br />
          Connect with Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and get Noticed in Virtual Competition
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        {editorPosts?.length > 0 && (
          <div className="max-w-7xl mx-auto px-5">
            {" "}
            {/* Added px-5 so arrows don't clip off screen */}
            <p className="text-30-semibold">Editor picks</p>
            {/* Use your new Client Component */}
            <EditorPicksCarousel editorPosts={editorPosts} />
          </div>
        )}
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>
        <Suspense
          fallback={<p className="text-20-regular">Loading startups...</p>}
        >
          <StartupList query={query} />
        </Suspense>
      </section>
    </>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  return (
    <>
      {/* ✅ Suspense boundary around everything that depends on searchParams */}
      <Suspense fallback={<p className="text-20-regular">Loading page...</p>}>
        <HomeContent searchParamsPromise={searchParams} />
      </Suspense>
      <SanityLive />
    </>
  );
}
