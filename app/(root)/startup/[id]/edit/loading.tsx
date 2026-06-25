import React from "react";
import { ImagePlus, Send } from "lucide-react";

export default function Loading() {
  return (
    <>
      {/* 1. Hero Section: Exact mirror of the page.tsx static layout */}
      <section className="hero_container !min-h-[230px]">
        <h1 className="heading">Edit Your Startup</h1>
      </section>

      {/* 2. Form Skeleton: Mirrors the structure of StartupForm.tsx */}
      <div className="startup-form">
        {/* Title */}
        <div>
          <label className="startup-form_label">Title</label>
          <div className="w-full h-[60px] mt-2 bg-black/5 animate-pulse rounded-md"></div>
        </div>

        {/* Description */}
        <div>
          <label className="startup-form_label">Description</label>
          {/* Matches the custom textarea minimum height[cite: 14] */}
          <div className="w-full h-[160px] mt-4 bg-black/5 animate-pulse rounded-s-md"></div>
          {/* Character counter placeholder[cite: 14] */}
          <div className="w-48 h-4 mt-2 ml-2 bg-black/5 animate-pulse rounded"></div>
        </div>

        {/* Category */}
        <div>
          <label className="startup-form_label">Category</label>
          <div className="w-full h-[60px] mt-2 bg-black/5 animate-pulse rounded-md"></div>
        </div>

        {/* Startup Image */}
        <div>
          <label className="startup-form_label">Startup Image</label>
          {/* Matches the h-32, dashed border, and layout of the image dropzone[cite: 14] */}
          <div className="flex flex-col items-center justify-center w-full h-32 px-4 mt-3 bg-white/5 border-2 border-dashed rounded-xl border-black/10 animate-pulse">
            <ImagePlus className="w-8 h-8 mb-3 text-black/10" />
            <div className="w-48 h-4 bg-black/10 rounded"></div>
          </div>
        </div>

        {/* Pitch */}
        <div>
          <label className="startup-form_label">Pitch</label>
          {/* Matches the 300px height and 20px border radius of the MDeditor[cite: 14] */}
          <div className="w-full h-[300px] mt-4 bg-black/5 animate-pulse rounded-[20px]"></div>
          {/* Character counter placeholder[cite: 14] */}
          <div className="w-48 h-4 mt-2 ml-2 bg-black/5 animate-pulse rounded"></div>
        </div>

        {/* Submit Button */}
        {/* Uses the exact class to lock in margins and padding, but overrides the background to look disabled[cite: 14] */}
        <div className="startup-form_btn mt-8 bg-black/10 opacity-70 flex justify-center items-center text-white/50 pointer-events-none">
          Update Startup <Send className="size-6 ml-2 opacity-50" />
        </div>
      </div>
    </>
  );
}
