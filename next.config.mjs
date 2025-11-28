/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8989",
        pathname: "/aimdev/api/files/public/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8989",
        pathname: "/aimdev/api/files/public/**",
      },
    ],
  },
};

export default nextConfig;
