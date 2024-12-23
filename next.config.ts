import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    domains: ["136.228.158.126", "api-inspectra.istad.co"],
    // Add the domain here
  },
};

export default nextConfig;
