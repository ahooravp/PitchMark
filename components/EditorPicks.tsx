import { client } from "@/sanity/lib/client";
import { PLAYLIST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import EditorPicksCarousel from "./EditorPicksCarousel";

export default async function EditorPicks() {
  // 1. Fetch the raw object without destructuring immediately
  const playlist = await client.fetch(PLAYLIST_BY_SLUG_QUERY, {
    slug: "editor-picks",
  });

  // 2. Safely extract the selection (handles the case where playlist is null)
  const editorPosts = playlist?.select;

  // 3. Early return if the data is missing or empty
  if (!editorPosts || editorPosts.length === 0) return null;

  return (
    <section className="w-full bg-primary/5 border-b border-black/5 py-4">
      <div className="max-w-7xl mx-auto px-6 mt-3">
        <div className="flex justify-between items-end ">
          <div>
            <span className="text-primary font-bold tracking-widest text-[12px] uppercase mb-1 block">
              Featured
            </span>
            <h2 className="text-26-semibold text-black-200">
              Editor&apos;s Spotlight
            </h2>
          </div>
          <button className="hidden sm:block text-sm font-semibold text-black-300 hover:text-primary transition-colors">
            View Collection &rarr;
          </button>
        </div>
      </div>
      <div className="max-w-7.5xl mx-auto px-6">
        <EditorPicksCarousel editorPosts={editorPosts} />
      </div>
    </section>
  );
}