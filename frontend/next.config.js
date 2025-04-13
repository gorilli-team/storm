/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gorillionai.re",
        port: "",
        pathname: "/external/**",
      },
    ],
  },
};

module.exports = nextConfig;
