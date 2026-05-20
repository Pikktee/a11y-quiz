import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Kompatibilität mit OpenAPI-Spec die /quiz/result ohne /api-Prefix nutzt
      { source: "/quiz/result", destination: "/api/quiz/result" },
      { source: "/quiz/result/:id", destination: "/api/quiz/result/:id" },
      { source: "/quiz/health", destination: "/api/quiz/health" },
    ];
  },
};

export default nextConfig;
