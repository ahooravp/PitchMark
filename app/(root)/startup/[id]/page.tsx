import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import RecentStartups from "@/components/RecentStartups";
import ViewTracker from "@/components/ViewTracker";
import { urlFor } from "@/sanity/lib/image";
import { auth } from "@/auth"; // <-- 1. Auth is properly imported
import { Button } from "@/components/ui/button"; // <-- 2. Button is imported
import DeleteStartupButton from "@/components/DeleteStartupButton";

const md = markdownit();

export const cachecomponent = true;

const page = async ({ params }: { params: { id: string } }) => {
  const id = (await params).id;

  // 3. We fetch the session here so TypeScript knows who is logged in!
  const session = await auth();

  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

  if (!post) return notFound();

  const parsedContent = md.render(post?.pitch || "");

  const imageUrl = post.image
    ? urlFor(post.image).width(1200).height(800).format("webp").url()
    : "https://placehold.co/1200x800/EEE/31343C?font=montserrat&text=No+Image";

  return (
    <>
      <section className="hero_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <div className="w-full bg-white-100 min-h-screen">
        <section className="section_container wide:max-w-10xl">
          <img
            src={imageUrl}
            alt="thumbnail"
            className="w-full max-w-5xl mx-auto h-auto min-h-[200px] sm:min-h-[300px] max-h-[550px] rounded-xl object-cover shadow-sm"
          />

          <div className="max-w-5xl mx-auto mt-8 sm:mt-12">
            {/* CRITICAL FIX: Locked to flex-row and items-center for all breakpoints */}
            <div className="flex flex-row justify-between items-center gap-3 py-4 px-5 sm:pl-4 sm:pr-6 rounded-2xl sm:rounded-l-full sm:rounded-r-none bg-gradient-to-br sm:bg-gradient-to-r from-primary/5 to-transparent mt-6 sm:mt-8">
              {/* CRITICAL FIX: Added min-w-0 to allow the text inside to shrink and truncate */}
              <Link
                href={`/user/${post.author?._id}`}
                className="flex gap-3 items-center group min-w-0"
              >
                <img
                  src={
                    post.author?.image ||
                    "https://placehold.co/64x64/EEE/31343C?font=montserrat&text=User"
                  }
                  alt="avatar"
                  // CRITICAL FIX: shrink-0 prevents the image from squishing when space gets tight
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full drop-shadow-sm transition-all duration-300 shadow-md group-hover:ring-2 ring-primary shrink-0"
                />

                <div className="flex flex-col min-w-0">
                  <p className="text-lg sm:text-2xl font-bold text-black-200 group-hover:text-primary transition-colors duration-300 truncate">
                    {post.author?.name}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-black-300 truncate">
                    @{post.author?.username}
                  </p>
                </div>
              </Link>

              {/* CRITICAL FIX: shrink-0 ensures the tag always stays its full width */}
              <p className="category-tag shrink-0">{post?.category}</p>
            </div>

            <hr className="divider" />

            <div className="mt-10">
              {/* 4. THE EDIT BUTTON SECTION */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-36-bold text-black-200">Pitch Details:</h3>
              </div>

              {parsedContent ? (
                <article
                  className="prose max-w-6xl font-work-sans break-words prose-headings:text-black-200 prose-p:text-black-300 prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline mt-4 bg-gradient-to-br from-primary/5 to-transparent px-5 py-6 sm:px-10 sm:py-10 rounded-2xl"
                  dangerouslySetInnerHTML={{ __html: parsedContent }}
                />
              ) : (
                <p className="no-result">No details provided.</p>
              )}
            </div>

            {/* This button ONLY appears if the logged-in user is the author of the post */}
            {session?.user?.id === post.author?._id && (
              <div className="flex gap-1 items-center ">
                <Button
                  asChild
                  className="rounded-full mt-4 bg-transparent text-primary hover:bg-primary/10 transition-colors duration-300"
                >
                  <Link href={`/startup/${id}/edit`}>Edit pitch</Link>
                </Button>

                <DeleteStartupButton
                  startupId={id}
                  authorId={post.author?._id || ""}
                />
              </div>
            )}
          </div>

          <ViewTracker id={id} />

          <Suspense fallback={<Skeleton className="view_skeleton" />}>
            <View id={id} />
          </Suspense>

          <RecentStartups currentId={id} />
        </section>
      </div>
    </>
  );
};

export default page;
