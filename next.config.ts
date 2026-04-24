/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{
      protocol: "https",
      hostname: "*"
    }]
  },
  // Use boolean, not string
  cacheComponents: true,   // Enables Partial Prerendering (recommended)
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
    buildActivityPosition: "bottom-right"
  }
};

export default nextConfig;