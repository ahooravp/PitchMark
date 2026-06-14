import Link from "next/link";
import { Suspense } from "react";
import { auth, signOut } from "@/auth";
import { BadgePlus, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";

async function UserActions() {
  const session = await auth();

  if (session && session?.id) {
    // Highly optimized fetch: memorized by Next.js until 'revalidateTag' is called
    const liveUser = await client.fetch(
      AUTHOR_BY_ID_QUERY, 
      { id: session.id },
      { next: { tags: [`user-profile-${session.id}`] } } 
    );

    return (
      <>
        <Link
          href={"/startup/create"}
          className="font-medium text-black-200 hover:text-primary transition-colors"
        >
          <span className="size-6 max-sm:hidden text-lg">Create</span>
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

        <Link href={`/user/${session?.id}`}>
          <Avatar className="size-10 cursor-pointer">
            <AvatarImage
              src={liveUser?.image || session?.user?.image || ""}
              alt={liveUser?.name || session?.user?.name || "User Avatar"}
              className="object-cover"
            />
            <AvatarFallback className="bg-black-200 text-white font-medium">
              {liveUser?.name?.charAt(0).toUpperCase() || session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </>
    );
  }

  // The unified, bulletproof entry point
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
          className="text-3xl font-bold tracking-tight flex items-center gap-1 group"
        >
          <img
            src="/pm-logo.png"
            alt="PitchMark Logo"
            className="h-6 w-auto transition-transform duration-300 flex align-bottom"
          />
          <p className="scale-105 group-hover:translate-x-1 transition-transform duration-300">
            <span className="text-primary">Pitch</span>
            <span>Mark</span>
          </p>
        </Link>
        <div className="flex items-center gap-5 text-black">
          <Suspense fallback={<span>Loading...</span>}>
            <UserActions />
          </Suspense>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;