import { SWRConfig } from 'swr'
import { render, screen, trpc } from './utils'

describe('Get key combined with SWR fallback', async () => {
	it('Should provide fallback data with getKey', async () => {
		const Component = () => {
			const { data } = trpc.hello.useSWR()

			return data ? <p>{data}</p> : <div>Loading...</div>
		}

		// This fallback should come from SSR
		const fallback = {
			[trpc.hello.getKey()]: 'world',
		}

		render(
			<SWRConfig
				value={{
					fallback,
				}}
			>
				<Component />
			</SWRConfig>,
		)

		expect(screen.getByText('world')).toBeInTheDocument()
	})

	it('Should provide fallback data with getKey and args', async () => {
		const Component = () => {
			const { data: user } = trpc.user.get.useSWR({ id: 1 })

			return user ? <p>{user.name}</p> : <div>Loading...</div>
		}

		// This fallback should come from SSR
		const fallback = {
			[trpc.user.get.getKey({ id: 1 })]: {
				name: 'bar',
			},
		}

		render(
			<SWRConfig
				value={{
					fallback,
				}}
			>
				<Component />
			</SWRConfig>,
		)

		expect(screen.getByText('bar')).toBeInTheDocument()
	})
})
