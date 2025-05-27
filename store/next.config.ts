import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/search',
        statusCode: 301
      }
    ]
  }
};

export default nextConfig;
