import { AppProps } from 'next/dist/shared/lib/router/router'
import { useState } from 'react'
import { withTRPCSWR } from '../../../src/next'
import { trpc } from '../utils/trpc'
import '../styles.css'
import SuperJSON from 'superjson'

const App = ({ Component, pageProps }: AppProps) => {
	const [client] = useState(() => trpc.createClient())
	return (
		<trpc.Provider client={client}>
			<Component {...pageProps} />
		</trpc.Provider>
	)
}

export default withTRPCSWR({
	transformer: SuperJSON,
})(App)
