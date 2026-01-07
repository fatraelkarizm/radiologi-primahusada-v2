import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // For demo deployment only - remove in production
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
