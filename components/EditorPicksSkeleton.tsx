import React from "react";

export default function EditorPicksSkeleton() {
  return (
    <section className="w-full bg-primary/5 border-b border-black/5 py-8">
      <div className="max-w-7.5xl mx-auto px-6">
        {/* Skeleton Header */}
        <div className="flex justify-between items-end mb-5">
          <div>
            <div className="w-16 h-3 bg-black/10 rounded mb-3 animate-pulse"></div>
            <div className="w-48 h-8 bg-black/10 rounded animate-pulse"></div>
          </div>
          <div className="hidden sm:block w-32 h-4 bg-black/10 rounded animate-pulse"></div>
        </div>

        {/* Skeleton Carousel */}
        <div className="relative group mt-7">
          <ul className="card_grid-sm-editor relative w-full overflow-hidden">
            {[1, 2, 3, 4].map((index) => (
              <li
                key={index}
                className="snap-center min-w-[300px] md:min-w-[350px]"
              >
                {/* Reusing your existing skeleton class from globals.css */}
                <div className="startup-card_skeleton"></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}