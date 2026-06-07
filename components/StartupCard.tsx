import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Author, Startup } from "@/sanity.types";
import { Skeleton } from "./ui/skeleton";
import { urlFor } from "@/sanity/lib/image";

export type StartupTypeCard = Omit<Startup, "author"> & {author?: Author}

const StartupCard = ({ 
  post, 
  variant = "default" 
}: { 
  post: StartupTypeCard, 
  variant?: "default" | "compact" 
}) => {
  const {_createdAt, views, author, description, image, category, title, _id} = post

  // Safely request a compressed WebP from Sanity, or use a placeholder
  const imageUrl = image 
    ? urlFor(image).width(800).height(500).format('webp').url() 
    : "https://placehold.co/800x500/EEE/31343C?font=montserrat&text=No+Image";

  return (
    <div className={cn("startup-card group", variant === "compact" && "!py-5 !px-5 !gap-4")}>
      <div className="flex-between">
        <p className="startup-card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
        </div>
      </div>
      
      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author?._id}`}>
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          </Link>
          <Link href={`/startup/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${author?._id}`}>
          {/* Added a fallback here to prevent Next.js <Image> errors if the author lacks an avatar */}
          <Image 
            src={author?.image || "https://placehold.co/48x48/EEE/31343C?font=montserrat&text=User"} 
            alt={author?.name || "Author Avatar"} 
            width={48} 
            height={48} 
            className="rounded-full" 
          />
        </Link>
      </div>
      
      <Link href={`/startup/${_id}`}>
        <p className={cn("startup-card_desc", variant === "compact" && "line-clamp-2")}>
          {description}
        </p>

        {/* Utilizing the reliable <img> tag powered by Sanity's CDN */}
        <img 
          src={imageUrl} 
          alt={title || "Startup Image"} 
          className={cn("startup-card_img", variant === "compact" && "!h-[100px] mt-3")}
        />
      </Link>

      <div className="flex-between gap-3 mt-5 ">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${_id}`}>Details</Link>
        </Button>
      </div>
    </div>
  );
};

export const StartupCardSkeleton = () => (
  <>
    {[0,1,2,3,4].map((index: number) => (
      <li key={cn("skeleton", index)}>
        <Skeleton className="startup-card_skeleton"/>
      </li>
    ))}
  </>
)

export default StartupCard;