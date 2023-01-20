import '@testing-library/jest-dom'
import { vi } from 'vitest'

import { fetch } from 'undici'

beforeAll(() => {
	if (!globalThis.fetch) {
		globalThis.fetch = fetch as any
	}
	vi.stubGlobal('fetch', fetch)
})
