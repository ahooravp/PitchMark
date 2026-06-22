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
        <section className="section_container">
          <img
            src={imageUrl}
            alt="thumbnail"
            className="w-full max-w-5xl mx-auto h-auto min-h-[300px] max-h-[550px] rounded-xl object-cover shadow-sm"
          />

          <div className="max-w-5xl mx-auto mt-12">
            <div className="flex-between gap-5 py-4 pl-4 pr-6 rounded-l-full bg-gradient-to-r from-primary/5 to-transparent mt-8">
              <Link
                href={`/user/${post.author?._id}`}
                className="flex gap-3 items-center group"
              >
                <img
                  src={
                    post.author?.image ||
                    "https://placehold.co/64x64/EEE/31343C?font=montserrat&text=User"
                  }
                  alt="avatar"
                  className="w-16 h-16 rounded-full drop-shadow-sm  transition-all duration-300 shadow-md group-hover:ring-2 ring-primary"
                />

                <div className="flex flex-col">
                  <p className="text-2xl font-bold text-black-200 group-hover:text-primary transition-colors duration-300">
                    {post.author?.name}
                  </p>
                  <p className="text-sm font-medium text-black-300">
                    @{post.author?.username}
                  </p>
                </div>
              </Link>

              <p className="category-tag">{post?.category}</p>
            </div>

            <hr className="divider" />

            <div className="mt-10">
              {/* 4. THE EDIT BUTTON SECTION */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-36-bold text-black-200">Pitch Details:</h3>
              </div>

              {parsedContent ? (
                <article
                  className="prose max-w-6xl font-work-sans break-all prose-headings:text-black-200 prose-p:text-black-300 prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline mt-4 bg-gradient-to-br from-primary/5 to-transparent px-10 py-10 rounded-2xl"
                  dangerouslySetInnerHTML={{ __html: parsedContent }}
                />
              ) : (
                <p className="no-result">No details provided.</p>
              )}
            </div>

            {/* This button ONLY appears if the logged-in user is the author of the post */}
            {session?.id === post.author?._id && (
              <Button
                asChild
                className="bg-transparent text-primary hover:text-primary-100 rounded-full mt-4"
              >
                <Link href={`/startup/${id}/edit`}>Edit Startup</Link>
              </Button>
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
