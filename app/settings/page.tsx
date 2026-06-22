import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import ProfileForm from "./ProfileForm"; 

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session?.id) {
    redirect("/login");
  }

  const user = await client.withConfig({ useCdn: false }).fetch(AUTHOR_BY_ID_QUERY, {
    id: session.id,
  });

  // Bulletproof Check: If the auth session exists but the database document is missing,
  // do not attempt to render the form.
  if (!user) {
    // You can redirect to an onboarding page, an error page, or back to login
    redirect("/"); 
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-14 px-5 pb-20 font-work-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-black-200 mb-8">Profile Settings</h1>

        <div className="bg-white/80 backdrop-blur-md border border-black/10 shadow-sm rounded-2xl p-8">
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}