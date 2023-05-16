import { test, expect } from "@playwright/test";

test("Status fetched is OK", async ({ page }) => {
	await page.goto("/");

	const status = await page.getByTestId("status").textContent();
	expect(status).toBe("ok");
});
