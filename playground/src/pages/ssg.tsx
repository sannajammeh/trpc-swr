import { GetStaticProps } from 'next'
import React from 'react'
import { createSSG } from '../server/ssg'
import { trpc as trpc } from '../utils/trpc'

const SSG = () => {
	const { data: user } = trpc.user.byId.useSWR({ id: 1 })
	return (
		<div>
			<h1>SSG</h1>
			<p>
				Inspect my html to see that the user is indeed present. SSG
			</p>
			<pre>
				<code>{JSON.stringify(user, null, 2)}</code>
			</pre>
		</div>
	)
}

export default SSG

export const getStaticProps: GetStaticProps = async () => {
	const trpc = createSSG()

	trpc.user.byId.fetch({ id: 1 })

	return {
		props: {
			swr: await trpc.dehydrate(),
		},
	}
}
