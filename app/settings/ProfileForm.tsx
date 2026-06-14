"use client";

import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "../actions/profile";
import SubmitButton from "./SubmitButton";
import AvatarUpload from "./AvatarUpload";

export default function ProfileForm({ user }: { user: any }) {
  const { toast } = useToast();

  // We wrap the server action in a client function to intercept the result
  const handleClientAction = async (formData: FormData) => {
    const result = await updateProfile(formData);

    if (result.success) {
      toast({
        title: "Success",
        description: "Your profile has been updated.",
        // Omitting the variant defaults to your white/green success styling
      });
    } else {
      toast({
        title: "Update Failed",
        description: result.error,
        variant: "destructive", // Triggers the red AlertCircle styling in your toast.tsx
      });
    }
  };

  return (
    <form action={handleClientAction} className="space-y-6">
      
      <AvatarUpload currentImage={user?.image} name={user?.name} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-black-100 mb-2">Username</label>
          <input 
            type="text" 
            disabled 
            defaultValue={user?.username} 
            className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl text-black-100 cursor-not-allowed opacity-70"
          />
          <p className="text-xs text-black-100/70 mt-2 font-medium">You can't change your username.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-black-100 mb-2">Email</label>
          <input 
            type="email" 
            disabled 
            defaultValue={user?.email} 
            className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl text-black-100 cursor-not-allowed opacity-70"
          />
          <p className="text-xs text-black-100/70 mt-2 font-medium">Linked to your sign-in provider.</p>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-black-200 mb-2">Display Name</label>
        <input 
          type="text" 
          id="name"
          name="name"
          required
          defaultValue={user?.name} 
          className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-black-200 mb-2">Biography</label>
        <textarea 
          id="bio"
          name="bio"
          rows={4}
          defaultValue={user?.bio} 
          className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
          placeholder="Tell the community about yourself..."
        />
      </div>

      <div className="pt-4 flex justify-end border-t border-black/5 mt-8">
         <SubmitButton />
      </div>

    </form>
  );
}