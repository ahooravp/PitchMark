import { sanityFetch } from "@/sanity/lib/live";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import StartupCard, { StartupTypeCard } from "./StartupCard";

export default async function StartupList({ query }: { query?: string }) {
  // We keep the wildcard logic here where the query actually happens
  const params = { search: query ? `*${query}*` : null };
  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  return (
    <ul className="mt-5 card_grid">
      {posts?.length > 0 ? (
        posts.map((post: StartupTypeCard) => (
          <StartupCard key={post?._id} post={post} />
        ))
      ) : (
        <p className="no-result">No startups found.</p>
      )}
    </ul>
  );
}