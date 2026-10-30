import type { NextConfig } from "next";

const backendUrl = (process.env.BACKEND_URL ?? "http://localhost:5000").replace(/\/$/, "");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Same-origin API proxy: the browser only ever talks to this Next.js app.
  // /api/* is forwarded to the Express backend, so the auth cookie stays
  // first-party (no third-party cookie blocking) and proxy.ts can read it.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/api/:path*` }];
  },
};

export default nextConfig;
