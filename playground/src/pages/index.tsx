import type { NextPage } from 'next'
import { trpc, useSWRInfinite } from '../utils/trpc'

const Home: NextPage = () => {
	const { data, mutate, isValidating } = trpc.useSWR(['user.get', { id: 2 }])
	const { client } = trpc.useContext()

	const { data: userData, size, setSize } = useSWRInfinite('user.get', (pageIndex, previousData) => {
		if (previousData === undefined) return null

		return [{ id: pageIndex }]
	})

	return (
		<>
			<div>
				Name: {!data && isValidating
					? 'loading...'
					: data
					? data.name
					: 'User does not exist'}
			</div>

			<button
				onClick={async () => {
					mutate(() => {
						return client.mutation('user.create', { name: 'trpc2' })
					}, { optimisticData: { name: 'trpc2' } })
				}}
			>
				Post Name
			</button>

			{userData?.map((user) => {
				if (!user) return
				return <div key={user?.name}>{user?.name ? `Name: ${user.name}` : 'loading...'}</div>
			})}

			<button
				onClick={() => {
					setSize(size + 1)
				}}
			>
				Load More Users
			</button>
		</>
	)
}

export default Home
