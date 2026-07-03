"use client";

import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadProps {
  currentImage: string;
  name: string;
}

export default function AvatarUpload({ currentImage, name }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create an instant, temporary local URL for the UI preview
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Hidden File Input attached to the FormData via the 'name' attribute */}
      <input
        type="file"
        name="avatar"
        accept="image/png, image/jpeg, image/webp"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      <div 
        className="relative group cursor-pointer shrink-0" 
        onClick={() => fileInputRef.current?.click()}
      >
        <Avatar className="size-20 sm:size-24 border-2 border-black/10 transition-all duration-300 shadow-md">
          <AvatarImage src={preview || currentImage || ""} alt={name} className="object-cover" />
          <AvatarFallback className="bg-black-200 text-white text-2xl font-medium">
            {name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 rounded-full bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Camera className="text-white size-6 sm:size-8" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-black-200">Profile picture</h3>
        <p className="text-[11px] sm:text-xs text-black-100/70 mt-1 max-w-[200px] sm:max-w-none">
          Click the avatar to upload a custom photo.<br className="hidden sm:block"/>
          JPG, PNG, or WebP. Max size 2MB.
        </p>
      </div>
    </div>
  );
}