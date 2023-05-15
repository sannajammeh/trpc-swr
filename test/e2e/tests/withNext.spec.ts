import { test, expect } from "@playwright/test";

test("Page renders with fallback and SWR", async ({ page }) => {
  await page.goto("/with-next");

  const result = await page.getByTestId("with-next").textContent();

  expect(result).toBe("with-next");
});
