/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'diligent-monitor-432.convex.cloud',
      }
    ]
  }
};

export default nextConfig;
