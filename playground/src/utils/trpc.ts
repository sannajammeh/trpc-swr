import { createSWRHooks, getUseMatchMutate } from '../../../src'
import { getUseSWRInfinite } from '../../../src/infinite'
import { AppRouter } from '../server/router'

export const trpc = createSWRHooks<AppRouter>()
export const useMatchMutate = getUseMatchMutate<AppRouter>()
export const useSWRInfinite = getUseSWRInfinite<AppRouter>()
