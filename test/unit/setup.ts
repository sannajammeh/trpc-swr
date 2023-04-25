import "@testing-library/jest-dom";
import "@testing-library/react";

import { beforeAll, vi } from "vitest";
import EventEmitter from "node:events";

beforeAll(() => {
	vi.stubGlobal("EventEmitter", EventEmitter);
});
