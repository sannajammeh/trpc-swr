/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    externalDir: true,
    appDir: true,
    esmExternals: true,
  },
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;