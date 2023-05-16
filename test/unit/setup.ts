import "@testing-library/jest-dom";
import "@testing-library/react";

import { beforeAll, vi } from "vitest";
import EventEmitter from "node:events";
import nodeFetch from "node-fetch";

beforeAll(() => {
  vi.stubGlobal("EventEmitter", EventEmitter);
  vi.stubGlobal("fetch", nodeFetch);
});
