export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50 pt-14 pb-20 px-5 font-work-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Page Title Skeleton */}
        <div className="h-9 w-48 bg-gray-200 animate-pulse rounded-md mb-8" />

        {/* The Glassmorphism Container */}
        <div className="bg-white/80 backdrop-blur-md border border-black/10 shadow-sm rounded-2xl p-8">
          <div className="space-y-6">
            
            {/* Avatar Section Skeleton */}
            <div className="flex items-center gap-6 mb-8">
              <div className="size-24 rounded-full bg-gray-200 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                <div className="h-3 w-48 bg-gray-200 animate-pulse rounded" />
                <div className="h-3 w-40 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>

            {/* 2-Column Grid Skeleton (Username & Email) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-12 w-full bg-gray-200 animate-pulse rounded-xl" />
                <div className="h-3 w-32 bg-gray-200 animate-pulse rounded mt-2" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-12 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-12 w-full bg-gray-200 animate-pulse rounded-xl" />
                <div className="h-3 w-40 bg-gray-200 animate-pulse rounded mt-2" />
              </div>
            </div>

            {/* Display Name Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2" />
              <div className="h-12 w-full bg-gray-200 animate-pulse rounded-xl" />
            </div>

            {/* Biography Textarea Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2" />
              <div className="h-32 w-full bg-gray-200 animate-pulse rounded-xl" />
            </div>

            {/* Submit Button Skeleton */}
            <div className="pt-4 flex justify-end border-t border-black/5 mt-8">
              <div className="h-12 w-32 bg-gray-200 animate-pulse rounded-full" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}