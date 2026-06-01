import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Grid: Asymmetrical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Left Column: Brand & Logo (Takes up 5/12 columns) */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-1 mb-6 group">
              {/* Visual Logo Placeholder - Swapped fixed width for dynamic padding and synced font */}
              <div className="px-3 h-10 bg-white rounded-xl flex items-center justify-center shadow-md  transition-transform">
                <span className="text-primary font-black text-[22px] tracking-tighter">
                  Pitch
                </span>
              </div>
              {/* Text Logo */}
              <h3 className="text-30-black text-white tracking-tight group-hover:text-white/80 transition-colors">
                Mark
              </h3>
            </Link>

            <p className="text-white/80 max-w-sm leading-relaxed text-[15px] mb-8">
              Pitch your startup, connect with entrepreneurs, and get noticed in
              our virtual competition. Build the future, today.
            </p>
          </div>

          {/* Right Columns: Navigation Links (Takes up 7/12 columns) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Nav Column 1 */}
            <div>
              <h4 className="text-white font-bold tracking-widest text-[12px] uppercase mb-6">
                Platform
              </h4>
              <ul className="space-y-4 text-[15px] font-medium">
                <li>
                  <Link
                    href="/"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Discover
                  </Link>
                </li>
                <li>
                  <Link
                    href="/startup/create"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Submit Idea
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leaderboard"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Nav Column 2 */}
            <div>
              <h4 className="text-white font-bold tracking-widest text-[12px] uppercase mb-6">
                Company
              </h4>
              <ul className="space-y-4 text-[15px] font-medium">
                <li>
                  <Link
                    href="/about"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Twitter / X
                  </a>
                </li>
              </ul>
            </div>

            {/* Nav Column 3 */}
            <div>
              <h4 className="text-white font-bold tracking-widest text-[12px] uppercase mb-6">
                Legal
              </h4>
              <ul className="space-y-4 text-[15px] font-medium">
                <li>
                  <Link
                    href="/privacy"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guidelines"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Guidelines
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Clean and Minimal */}
        <div className="border-t border-white/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm font-medium">
            &copy; 2026 PitchMark. All rights reserved.
          </p>

          <div className="flex gap-4">
            <span className="text-white/60 text-sm font-medium">
              Designed for Founders
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
