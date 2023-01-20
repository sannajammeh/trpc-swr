/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	experimental: {
		externalDir: true,
		serverComponentsExternalPackages: ['swr'],
		appDir: true,
	},
}

// eslint-disable-next-line no-undef
module.exports = nextConfig
