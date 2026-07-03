import Link from "next/link";
import { Suspense } from "react";
import { auth, signOut } from "@/auth";
import { BadgePlus, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";

function NavbarSkeleton() {
  return (
    <div className="flex gap-4 items-center animate-pulse">
      {/* 1. 'Create' Placeholder */}
      <div className="max-sm:hidden w-14 h-6 bg-black/10 rounded"></div>
      <div className="sm:hidden size-6 bg-black/10 rounded"></div>

      {/* 2. 'Logout' Placeholder */}
      <div className="max-sm:hidden w-16 h-6 bg-black/10 rounded"></div>
      <div className="sm:hidden size-6 bg-black/10 rounded"></div>

      {/* 3. Avatar Placeholder */}
      <div className="size-10 bg-black/10 rounded-full"></div>
    </div>
  );
}

async function UserActions() {
  const session = await auth();

  if (session && session?.user?.id) {
    // Highly optimized fetch: memorized by Next.js until 'revalidateTag' is called
    const liveUser = await client.fetch(
      AUTHOR_BY_ID_QUERY,
      { id: session?.user?.id },
      { next: { tags: [`user-profile-${session?.user?.id}`] } },
    );

    return (
      <>
        <Link
          href={"/startup/create"}
          className="font-medium text-black-200 hover:text-primary transition-colors flex items-center"
        >
          <span className="max-sm:hidden text-lg">Create</span>
          <BadgePlus className="size-6 sm:hidden" />
        </Link>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="font-medium flex items-center hover:text-primary transition-colors text-black-200"
          >
            <span className="max-sm:hidden text-lg">Logout</span>
            <LogOut className="size-6 sm:hidden transition-colors" />
          </button>
        </form>

        <Link href={`/user/${session?.user?.id}`}>
          <Avatar className="size-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
            <AvatarImage
              src={liveUser?.image || session?.user?.image || ""}
              alt={liveUser?.name || session?.user?.name || "User Avatar"}
              className="object-cover"
            />
            <AvatarFallback className="bg-black-200 text-white font-medium">
              {liveUser?.name?.charAt(0).toUpperCase() ||
                session?.user?.name?.charAt(0).toUpperCase() ||
                "U"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </>
    );
  }

  return (
    <div className="flex gap-4 items-center">
      <Link
        href="/login"
        className="hover:text-primary text-black-200 text-[15px] transition-colors font-medium"
      >
        Log In
      </Link>
      <Link
        href="/signup"
        className="bg-black-200 text-white hover:bg-black-300 px-5 py-2.5 rounded-full text-[15px] transition-colors font-medium"
      >
        Sign Up
      </Link>
    </div>
  );
}

const Navbar = () => {
  return (
    <header className="fixed w-full z-20 px-5 py-3 bg-white font-work-sans shadow-sm">
      <nav className="flex justify-between items-center">
        <Link
          href="/"
          className="text-3xl font-bold tracking-tight flex items-center gap-1 group max-xxs:text-2xl"
        >
          <img
            src="/pm-logo.png"
            alt="PitchMark Logo"
            className="h-6 w-auto transition-transform duration-300 flex align-bottom max-xxs:h-5"
          />
          <p className="scale-105 [@media(hover:hover)]:group-hover:translate-x-1 group-active:translate-x-1 transition-transform duration-300">
            <span className="text-primary">Pitch</span>
            <span>Mark</span>
          </p>
        </Link>
        <div className="flex items-center gap-4 text-black">
          <Suspense fallback={<NavbarSkeleton />}>
            <UserActions />
          </Suspense>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
