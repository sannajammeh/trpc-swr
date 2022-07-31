import { expect, it } from 'vitest'
import { render, screen, trpc, waitFor } from './utils'

it('makes query without args', async () => {
	const Component = () => {
		const { data } = trpc.useSWR(['hello'])

		return data ? <p>{data}</p> : <div>Loading...</div>
	}

	render(<Component />)

	expect(screen.getByText('Loading...')).toBeInTheDocument()

	await waitFor(() => {
		expect(screen.getByText('world')).toBeInTheDocument()
	})
})

it('makes query with args', async () => {
	const Component = () => {
		const { data: user } = trpc.useSWR(['user.get', { id: 1 }])

		return user ? <p>{user.name}</p> : <div>Loading...</div>
	}

	render(<Component />)

	expect(screen.getByText('Loading...')).toBeInTheDocument()

	await waitFor(() => {
		expect(screen.getByText('bar')).toBeInTheDocument()
	})
})
