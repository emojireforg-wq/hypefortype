/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow private-fonts to be excluded from the build
  outputFileTracingExcludes: {
    '*': ['./private-fonts/**/*'],
  },
}
module.exports = nextConfig
