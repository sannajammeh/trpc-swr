import "@testing-library/jest-dom";
import { vi } from "vitest";
import EventEmitter from "node:events";
import fetch from "node-fetch";

beforeAll(() => {
  if (!globalThis.fetch) {
    globalThis.fetch = fetch as any;
  }
  vi.stubGlobal("fetch", fetch);

  vi.stubGlobal("EventEmitter", EventEmitter);
});
