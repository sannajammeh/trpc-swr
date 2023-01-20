import type { ClientDataTransformerOptions } from '@trpc/server'
import { memo } from 'react'
import { SWRConfig } from 'swr'
import { useTransformFallback } from '../shared/useTransformedFallback'

interface SWRProviderProps {
	children: React.ReactNode
	fallback?: Record<any, any>
}

const _SWRProvider = ({ children, fallback = {} }: SWRProviderProps) => {
	return (
		<SWRConfig
			value={{
				fallback,
			}}
		>
			{children}
		</SWRConfig>
	)
}

export const SWRProvider = memo(_SWRProvider)

type Config = {
	transformer?: ClientDataTransformerOptions
}

export const withTRPCSWR =
	({ transformer }: Config = {}) => <T extends Record<any, any>>(Component: React.ComponentType<any>) => {
		return (props: T) => {
			const { pageProps } = props
			const { swr } = pageProps || {}
			const transformedFallback = useTransformFallback(swr, transformer)

			return (
				<SWRProvider fallback={transformedFallback}>
					<Component {...props} />
				</SWRProvider>
			)
		}
	}
