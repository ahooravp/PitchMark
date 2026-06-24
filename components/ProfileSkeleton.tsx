export const ProfileSkeleton = () => {
  return (
    <div className="profile_card animate-pulse mb-24">
      
      {/* 1. Title: Relies strictly on globals.css for positioning and width */}
      <div className="profile_title">
        {/* Mimics the height of the h3 text-24-white */}
        <div className="w-3/4 h-[32px] bg-black/10 rounded mx-auto"></div>
      </div>

      {/* 2. Image: Removed 'my-4'. Applied 'profile_image' to inherit the 2px border */}
      <div className="w-[220px] h-[220px] bg-white/20 rounded-full profile_image"></div>

      {/* 3. Username: Matches the exact mt-7 of the loaded text */}
      <div className="w-48 h-8 bg-white/20 rounded-md mt-8 mb-4"></div>
            
      {/* 5. Edit Button: Matches mt-4 and the exact 40px height of the rendered link */}
      <div className="mt-4 w-full h-[40px] bg-white/20 rounded-full"></div>
      
    </div>
  );
};