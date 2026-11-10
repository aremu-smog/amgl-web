/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Served at aremusmog.com/amgl via a rewrite on the main site
  basePath: "/amgl",
  async redirects() {
    // Keep existing share links (amgl.aremusmog.com/<user>/<question>) working
    return [
      {
        source: "/",
        destination: "/amgl",
        basePath: false,
        permanent: false,
      },
      {
        source: "/:path((?!amgl(?:/|$)).*)",
        destination: "/amgl/:path",
        basePath: false,
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
