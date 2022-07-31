import '@testing-library/jest-dom'
import { fetch } from 'undici'

beforeAll(() => {
	vi.stubGlobal('fetch', fetch)
})
