'use client'
import React, { PropsWithChildren, useState } from 'react'
import { trpc } from '../utils/trpc'

// eslint-disable-next-line @typescript-eslint/ban-types
const Providers = ({ children }: PropsWithChildren<{}>) => {
	const [client] = useState(() => trpc.createClient())
	return <trpc.Provider client={client}>{children}</trpc.Provider>
}

export default Providers
