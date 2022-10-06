import { useState } from 'react'
import { act } from 'react-dom/test-utils'
import { expect, it } from 'vitest'
import { render, screen, trpc, waitFor } from './utils'

it('makes query without args', async () => {
	const Component = () => {
		const { data } = trpc.hello.useSWR();

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
		const { data: user } = trpc.user.get.useSWR({id: 1})

		return user ? <p>{user.name}</p> : <div>Loading...</div>
	}

	render(<Component />)

	expect(screen.getByText('Loading...')).toBeInTheDocument()

	await waitFor(() => {
		expect(screen.getByText('bar')).toBeInTheDocument()
	})
})

it('makes conditional query', async () => {
	const Component = () => {
		const [shouldFetch, setShouldFetch] = useState(true)

		const { data } = trpc.hello.useSWR(undefined, {
			isDisabled: !shouldFetch,
		})

		return (
			<>
				<button onClick={() => setShouldFetch(false)}>toggle</button>
				<div>{data ? data : 'disabled'}</div>
			</>
		)
	}

	render(<Component />)

	await waitFor(() => {
		expect(screen.getByText('world')).toBeInTheDocument()
	})

	const toggleButton = await screen.findByText('toggle')

	act(() => toggleButton.click())

	await waitFor(() => {
		expect(screen.getByText('disabled')).toBeInTheDocument()
	})
})
