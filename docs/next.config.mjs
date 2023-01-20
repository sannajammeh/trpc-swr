import Nextra from 'nextra'

const withNextra = Nextra({
	theme: 'nextra-theme-docs',
	themeConfig: './theme.config.tsx',
	staticImage: true,
})

export default withNextra({
	experimental: {
		externalDir: true,
	},
})
