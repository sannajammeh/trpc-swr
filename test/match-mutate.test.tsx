import { useEffect, useRef } from 'react'
import { expect, it } from 'vitest'
import { getUseMatchMutate } from '../src'
import { AppRouter } from './router'
import { render, screen, trpc, waitFor } from './utils'

it('refetches invalidated queries', async () => {
  const useMatchMutate = getUseMatchMutate<AppRouter>()

  const Component = () => {
    const { data: user0Data, isValidating: isUser0Validating } = trpc.useSWR(['user.get', { id: 0 }])
    const { data: user1Data, isValidating: isUser1Validating } = trpc.useSWR(['user.get', { id: 1 }])

    const hasChangedNamesRef = useRef(false)
    const { client } = trpc.useContext()
    const matchMutate = useMatchMutate()

    useEffect(() => {
      if (hasChangedNamesRef.current) return

      if (user0Data && user1Data) {
        hasChangedNamesRef.current = true
        matchMutate('user.get', async () => {
          await Promise.all([
            client.mutation('user.changeName', { id: 0, newName: 'fooChanged' }),
            client.mutation('user.changeName', { id: 1, newName: 'barChanged' }),
          ])
        })
      }
    }, [user0Data, user1Data])

    if ((!user0Data && isUser0Validating) || (!user1Data && isUser1Validating)) {
      return <div>Loading...</div>
    }

    return (
      <div>
        {[user0Data, user1Data].map((data) => <p key={data?.name}>{data ? data.name : 'User not found'}</p>)}
      </div>
    )
  }

  render(<Component />)

  expect(screen.getByText('Loading...')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByText('foo')).toBeInTheDocument()
    expect(screen.getByText('bar')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.getByText('fooChanged')).toBeInTheDocument()
    expect(screen.getByText('barChanged')).toBeInTheDocument()
  })
})
