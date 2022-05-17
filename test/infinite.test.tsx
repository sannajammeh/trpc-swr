import { it } from 'vitest'
import { getUseSWRInfinite } from '../src/infinite'
import { AppRouter } from './router'
import { render, screen, userEvent, waitFor } from './utils'

it('makes infinite query', async () => {
  const useSWRInfinite = getUseSWRInfinite<AppRouter>()

  const Component = () => {
    const { data, setSize, size } = useSWRInfinite('user.get', (index, previousPageData) => {
      if (index !== 0 && !previousPageData) return null

      return [{ id: index }]
    })

    if (!data) {
      return <div>Loading...</div>
    }

    return (
      <>
        <div>
          {data.map((user) => {
            return <p key={user.name}>{user.name}</p>
          })}
        </div>

        <button onClick={() => setSize(size + 1)}>Load More</button>
      </>
    )
  }

  render(<Component />)

  expect(screen.getByText('Loading...')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByText('foo')).toBeInTheDocument()
  })

  await userEvent.click(screen.getByText('Load More'))

  await waitFor(() => {
    expect(screen.getByText('foo')).toBeInTheDocument()
    expect(screen.getByText('bar')).toBeInTheDocument()
  })
})
