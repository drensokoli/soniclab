/** @type {import('next').NextConfig} */
const runtimeCaching = require("next-pwa/cache");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
};

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching,
  disable: process.env.NODE_ENV === "development",
})

// module.exports = nextConfig

module.exports = withPWA({
  nextConfig,
  images: {
    domains: ['image.tmdb.org', 'i.scdn.co'],
    unoptimized: true,
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  }
})