"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full sm:w-auto px-6 py-3 rounded-full text-[15px] font-medium transition-all duration-300 ${
        pending 
          ? "bg-black-100 text-white/70 cursor-not-allowed" 
          : "bg-black-200 text-white active:bg-primary [@media(hover:hover)]:hover:bg-primary"
      }`}
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}