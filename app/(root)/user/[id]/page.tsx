import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // Ensure Link is imported
import UserStartups from "@/components/UserStartups";
import { Suspense } from "react";
import { StartupCardSkeleton } from "@/components/StartupCard";

export const cacheComponent = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return notFound();

  // Bulletproof check: Does the logged-in user own this profile?
  const isProfileOwner = session?.id === id;

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-white uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>

          <Image
            src={user.image || "https://placehold.co/220x220/EEE/31343C?font=montserrat&text=User"}
            alt={user.name || "User"}
            width={220}
            height={220}
            className="profile_image"
          />

          <p className="text-26-bold-white mt-7 text-center">
            @{user?.username}
          </p>
          <p className="mt-1 text-center text-14-normal mb-4">{user?.bio}</p>
          
          {/* Conditionally rendered Edit Profile button */}
          {isProfileOwner && (
            <Link 
              href={`/user/${id}/edit`} 
              className="mt-4 px-4 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors text-center w-full"
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
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartups id={id} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Page;