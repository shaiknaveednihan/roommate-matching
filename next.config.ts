import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server's JavaScript load when you open the site as
  // http://127.0.0.1:3000 (or in VS Code's preview) instead of localhost.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
