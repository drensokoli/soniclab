/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

// module.exports = nextConfig
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org', 'i.scdn.co'],
    unoptimized: true,
  }
}
