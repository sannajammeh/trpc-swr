import { useEffect } from 'react'
import { expect, it } from 'vitest'
import { render, screen, trpc, waitFor } from './utils'

it('refetches query', async () => {
  let renderCount = 0

  const Component = () => {
    const { data, mutate } = trpc.useSWR(['user.get', { id: 2 }])
    const { client } = trpc.useContext()

    renderCount += 1

    useEffect(() => {
      if (!data) {
        mutate(async () => {
          await client.mutation('user.create', { name: 'baz' })
        })
      }
    }, [data])

    return <p>{data ? data.name : 'User not found'}</p>
  }

  render(<Component />)

  expect(screen.getByText('User not found')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByText('baz')).toBeInTheDocument()
  })

  expect(renderCount).toBe(2)
})
