import Link from "next/link" 
import Image from "next/image"
import { Suspense } from "react"
import { auth, signIn, signOut } from "@/auth"

async function UserActions() {
  const session = await auth()
  
  if (session && session?.user) {
    return (
      <>
        <Link href={"/startup/create"}>
          <span>Create</span>
        </Link>

        <form action={async () => {
          "use server"
          await signOut({redirectTo: "/"})
        }}>
          <button type="submit">
            Logout
          </button>
        </form>

        <Link href={`/user/${session?.id}`}>
          <span>{session?.user?.name}</span>
        </Link>
      </>
    )
  }

  return (
    <form action={async () => {
      "use server"
      await signIn('github')
    }}>
      <button type="submit">
        Login
      </button>
    </form>
  )
}

const Navbar = () => {
  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30}/>
        </Link>
        <div className="flex items-center gap-5 text-black">
          <Suspense fallback={<span>Loading...</span>}>
            <UserActions />
          </Suspense>
        </div>
      </nav>
    </header>
  )
}

export default Navbar