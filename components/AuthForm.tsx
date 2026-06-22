import { signIn } from "@/auth";
import Link from "next/link";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-work-sans px-5">
      <div className="w-full max-w-md p-8 border border-black/10 shadow-lg rounded-2xl bg-white">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img src="/pm-logo.png" alt="PitchMark Logo" className="h-8 w-auto mx-auto" />
          </Link>
          
          <h1 className="text-3xl font-bold text-black-200">
            {isLogin ? "Welcome back" : "Join PitchMark"}
          </h1>
          <p className="text-black-100 mt-2 font-medium">
            {isLogin ? "Log in to your account to continue." : "Your first pitch is just a sign-up away."}
          </p>
        </div>

        <div className="space-y-4">
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-black-200 text-white hover:bg-black-300 py-3 px-4 rounded-full font-medium transition-colors"
            >
              <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" className="size-5 invert" />
              Continue with GitHub
            </button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-white text-black-200 border border-black/10 hover:bg-black/5 py-3 px-4 rounded-full font-medium transition-colors"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="size-5" />
              Continue with Google
            </button>
          </form>
        </div>
        
        {/* Toggle link for users who clicked the wrong button */}
        <div className="mt-6 text-center text-sm font-medium text-black-100">
          {isLogin ? (
            <p>Don&apos;t have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link></p>
          ) : (
            <p>Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link></p>
          )}
        </div>

      </div>
    </div>
  );
}