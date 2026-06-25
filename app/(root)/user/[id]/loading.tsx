import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import { UserStartupsSkeleton } from "@/components/UserStartups";

export default function Loading() {
  return (
    <section className="profile_container">
      {/* Left Column: The Profile Card Skeleton */}
      <ProfileSkeleton />

      {/* Right Column: The Startups List Skeleton */}
      <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
        
        {/* CRITICAL FIX: Skeleton for the "Your/All Startups" text heading. 
            Without this, the startup skeleton cards would jump down 38px when 
            the real text loads, causing a Cumulative Layout Shift (CLS). 
        */}
        <div className="w-56 h-[38px] bg-black/10 rounded-md animate-pulse"></div>
        
        <ul className="card_grid-sm">
          <UserStartupsSkeleton />
        </ul>
      </div>
    </section>
  );
}