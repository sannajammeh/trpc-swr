import { test, expect } from "@playwright/test";

test("[RSC] - Direct usage", async ({ page }) => {
	await page.goto("http://localhost:3231");

	expect(page.getByTestId("status")).toBeDefined();

	expect(await page.getByTestId("status").textContent()).toContain("ok");
});

test("[RSC] - Fetch notifications direct", async ({ page }) => {
	await page.goto("http://localhost:3231");

	expect(
		page.getByTestId("ssg-notifications").getByTestId("notification-7"),
	).toBeDefined();
});

test("[RSC, CLIENT] - SSG.fetch SWRConfig", async ({ page }) => {
	await page.goto("http://localhost:3231");

	expect(
		page.getByTestId("client-notifications").getByTestId("notification-7"),
	).toBeDefined();
});

test("[CLIENT] - SWRConfig mutation and revalidation of cache", async ({
	page,
}) => {
	await page.goto("http://localhost:3231");

	await page.getByLabel("Title").fill("Testing");
	await page.getByLabel("Body").fill("Testing");

	await page.getByRole("button", { name: "Add Notification" }).click();

	expect(
		page.getByTestId("client-notifications").getByTestId("notification-8"),
	).toBeDefined();
});
