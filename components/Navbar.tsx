import Link from "next/link";
import { Suspense } from "react";
import { auth, signIn, signOut } from "@/auth";
import { BadgePlus, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

async function UserActions() {
  const session = await auth();

  if (session && session?.user) {
    return (
      <>
        {/* Added hover:text-primary and transition */}
        <Link
          href={"/startup/create"}
          className=" font-medium text-black-200 hover:text-primary  transition-colors"
        >
          <span className="size-6 max-sm:hidden text-lg ">Create</span>
          <BadgePlus className="size-6 sm:hidden" />
        </Link>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          {/* Added hover:text-primary and transition */}
          <button
            type="submit"
            className="font-medium flex items-center hover:text-primary  transition-colors text-black-200 "
          >
            <span className="max-sm:hidden text-lg ">Logout</span>
            <LogOut className="size-6  sm:hidden  transition-colors" />
          </button>
        </form>

        <Link href={`/user/${session?.id}`}>
          {/* Removed hover:ring-offset-2 so the ring hugs the image tightly */}
          <Avatar className="size-10 hover:ring-2 hover:ring-primary transition-all duration-300 cursor-pointer">
            <AvatarImage
              src={session?.user?.image || ""}
              alt={session?.user?.name || ""}
            />
            <AvatarFallback>AV</AvatarFallback>
          </Avatar>
        </Link>
      </>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      {/* Added hover:text-primary and transition */}
      <button
        type="submit"
        className="hover:text-primary text-black-200 text-lg transition-colors font-medium"
      >
        Login
      </button>
    </form>
  );
}

const Navbar = () => {
  return (
    <header className=" fixed w-full z-20 px-5 py-3 bg-white font-work-sans shadow-sm">
      <nav className="flex justify-between items-center">
        <Link
          href="/"
          className="text-3xl font-bold tracking-tight flex items-center gap-1 group"
        >
          <img
            src="/pm-logo.png"
            alt=""
            className="h-6 w-auto  transition-transform duration-300 flex align-bottom"
          />{" "}
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
