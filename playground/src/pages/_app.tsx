import type { AppProps } from 'next/app'
import { useState } from 'react'
import { trpc } from '../utils/trpc'

const App = ({ Component, pageProps }: AppProps) => {
	const [client] = useState(() => trpc.createClient())
	return (
		<trpc.Provider client={client}>
			<Component {...pageProps} />
		</trpc.Provider>
	)
}

export default App
