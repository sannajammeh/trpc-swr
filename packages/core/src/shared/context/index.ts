import { TRPCClient } from '@trpc/client'
import { AnyRouter } from '@trpc/server'
import { createContext } from 'react'

export interface TRPCContextType<TRouter extends AnyRouter> {
	client: TRPCClient<TRouter>
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const TRPCContext = createContext(null!)
