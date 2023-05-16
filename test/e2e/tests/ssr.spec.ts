import { expect, test } from "@playwright/test";

test("SSR.fetch()", async ({ page }) => {
	await page.goto("http://localhost:3232/ssr?delay=300");

	expect(
		await page
			.getByTestId("props")
			.getByTestId("initial")
			.textContent({ timeout: 100 }),
	).toBe("ok");
	expect(
		await page
			.getByTestId("props")
			.getByTestId("swr")
			.textContent({ timeout: 100 }),
	).toBe("ok");
});

test("SSR.dehydrate() with SWRConfig", async ({ page }) => {
	await page.goto("http://localhost:3232/ssr?delay=200"); // 200ms delay

	expect(
		await page
			.getByTestId("fallback")
			.getByTestId("swr")
			.textContent({ timeout: 100 }),
	).toContain("world");
	expect(
		await page
			.getByTestId("no-fallback")
			.getByTestId("swr")
			.textContent({ timeout: 100 }),
	).toContain("waiting");
});

test("Static Site Generation - SSR.dehydrate()", async ({ page }) => {
	await page.goto("http://localhost:3232/ssg"); // 200ms delay

	expect(
		await page.getByTestId("initial-status").textContent({ timeout: 100 }),
	).toBe("ok");

	expect(await page.getByTestId("swr").textContent({ timeout: 100 })).toBe(
		"ok",
	);
	const content = await page
		.getByTestId("fallback")
		.textContent({ timeout: 100 });
	expect(content).toContain("world");
	expect(content).toContain("ok");
});
