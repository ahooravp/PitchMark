import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound, redirect } from "next/navigation";
import StartupForm from "@/components/StartupForm";

export default async function EditStartupPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const session = await auth();

  // 1. Kick them out if they aren't logged in
  if (!session) redirect("/");

  // 2. Fetch the specific startup
  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });
  if (!post) return notFound();

  // 3. SECURITY GATE: Kick them out if they are not the author of this post
  if (session?.user?.id !== post.author?._id) {
    redirect(`/startup/${id}`);
  }

  return (
    <>
      <section className="hero_container !min-h-[230px]">
        <h1 className="heading">Edit Your Startup</h1>
      </section>

      {/* 4. Pass the fetched data to our reusable form */}
      <StartupForm initialData={post} />
    </>
  );
}