import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import UserStartups, { UserStartupsSkeleton } from "@/components/UserStartups";
import { Suspense } from "react";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";

export const cacheComponent = true;

// 1. ProfileDetails now accepts the raw params Promise
async function ProfileDetails({ params }: { params: Promise<{ id: string }> }) {
  // Await the params safely inside the Suspense boundary!
  const id = (await params).id;

  const [session, user] = await Promise.all([
    auth(),
    client.fetch(AUTHOR_BY_ID_QUERY, { id }),
  ]);

  if (!user) return notFound();

  const isProfileOwner = session?.id === id;

  return (
    <>
      <div className="profile_card">
        <div className="profile_title">
          <h3 className="text-24-white uppercase text-center line-clamp-1">
            {user.name}
          </h3>
        </div>

        <Image
          src={
            user.image ||
            "https://placehold.co/220x220/EEE/31343C?font=montserrat&text=User"
          }
          alt={user.name || "User"}
          width={220}
          height={220}
          className="profile_image"
        />

        <p className="text-26-bold-white mt-7 text-center">@{user?.username}</p>
        <p className="mt-1 text-center text-14-normal mb-4">{user?.bio}</p>

        {isProfileOwner && (
<Link 
  href={`/settings`} 
  className="mt-4 px-4 py-2 bg-transparent text-white rounded-full font-bold border-2 border-white/50 hover:bg-white hover:text-black-200 hover:border-white hover:-translate-y-1   transition-all duration-300 text-center w-full block"
>
  Edit Profile
</Link>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
        <p className="text-30-bold">
          {isProfileOwner ? "Your" : "All"} Startups
        </p>
        <ul className="card_grid-sm">
          <Suspense fallback={<UserStartupsSkeleton />}>
            <UserStartups id={id} />
          </Suspense>
        </ul>
      </div>
    </>
  );
}

// 2. The main Page is no longer 'async' and does not block.
// It instantly returns the shell and Suspense boundary.
const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <section className="profile_container">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileDetails params={params} />
      </Suspense>
    </section>
  );
};

export default Page;
