/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	experimental: {
		externalDir: false,
		appDir: true,
	},
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
