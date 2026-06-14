"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-6 py-3 rounded-full text-[15px] font-medium transition-all duration-300 ${
        pending 
          ? "bg-black-100 text-white/70 cursor-not-allowed" 
          : "bg-black-200 text-white hover:bg-primary"
      }`}
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}