import '@testing-library/jest-dom'
import { vi } from 'vitest'

import { fetch } from 'cross-fetch'

beforeAll(() => {
	global.fetch = fetch as any
	vi.stubGlobal('fetch', fetch)
})
