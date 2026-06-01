import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Author, Startup } from "@/sanity.types";
import { Skeleton } from "./ui/skeleton";

export type StartupTypeCard = Omit<Startup, "author"> & {author?: Author}

const StartupCard = ({ 
  post, 
  variant = "default" 
}: { 
  post: StartupTypeCard, 
  variant?: "default" | "compact" 
}) => {
  const {_createdAt, views, author, description, image, category, title, _id} = post

  return (
    // Relaxed the compact padding slightly so the description fits nicely
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
          <Image src={author?.image!} alt={author?.name!} width={48} height={48} className="rounded-full" />
        </Link>
      </div>
      
      <Link href={`/startup/${_id}`}>
        {/* The description is now visible on BOTH variants */}
        {/* I added a conditional line-clamp-2 just in case the description is very long */}
        <p className={cn("startup-card_desc", variant === "compact" && "line-clamp-2")}>
          {description}
        </p>

        {/* Increased the compact image height from 90px to 140px */}
        <img 
          src={image} 
          alt="placeholder" 
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