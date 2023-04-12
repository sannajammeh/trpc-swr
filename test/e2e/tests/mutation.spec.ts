import { test, expect } from "@playwright/test";

test("<procedure>.useSWRMutation mutation", async ({ page }) => {
	await page.goto(
		`http://localhost:3232/simple-mutation?name=${encodeURIComponent(
			"Test user",
		)}`,
	);

	expect(page.getByText("Waiting for reset...")).toBeDefined();

	await page.getByRole("button", { name: "Create User" }).click();

	expect(page.getByTestId("loading")).toBeDefined();

	expect(page.getByTestId("user")).toBeDefined();

	expect(await page.getByTestId("user-name").textContent()).toBe("Test user");
});

test("<procedure>.useSWRMutation error", async ({ page }) => {
	await page.goto("http://localhost:3232/simple-mutation");

	expect(page.getByText("Waiting for reset...")).toBeDefined();

	await page.getByText("Throw error?").click();

	await page.waitForTimeout(32);
	await page.getByRole("button", { name: "Create User" }).click();

	expect
		.poll(async () => page.getByTestId("loading").textContent())
		.toBe("Loading...");

	expect(page.getByTestId("error-message")).toBeDefined();

	expect(await page.getByTestId("error-message").textContent()).toContain(
		"This is an error",
	);
});

test("<procedure>.useSWRMutation reset", async ({ page }) => {
	await page.goto("http://localhost:3232/simple-mutation");

	expect(page.getByText("Waiting for reset...")).toBeDefined();

	await page.getByRole("button", { name: "Create User" }).click();

	expect(
		await page.getByTestId("mutation-card").getAttribute("data-test-state"),
	).toBe("user-created");

	await page.getByRole("button", { name: "Reset" }).click();

	expect
		.poll(async () => page.locator("[data-test-state='empty']").first())
		.toBeDefined();
});

test("<procedure>.useSWRMutation and revalidation", async ({ page }) => {
	await page.goto("http://localhost:3232/mutation");
	await page.getByRole("button", { name: "Reset" }).click();

	await expect
		.poll(async () => page.locator("[data-testid='list-user']").count())
		.toBe(0);

	await page.getByPlaceholder("Enter name...").click();
	await page.getByPlaceholder("Enter name...").fill("Testing-1");
	await page.getByRole("button", { name: "Submit" }).click();

	expect(page.getByTestId("created-user-1").isVisible()).toBeTruthy();
	await page
		.getByTestId("list-user")
		.first()
		.getByTestId("user-name")
		.waitFor();

	expect(
		page.getByTestId("list-user").first().getByTestId("user-name"),
	).toContainText("Testing-1");

	await page.getByPlaceholder("Enter name...").click();
	await page.getByPlaceholder("Enter name...").fill("Testing-2");
	await page.getByRole("button", { name: "Submit" }).click();

	await expect
		.poll(async () => page.locator("[data-testid='list-user']").count())
		.toBe(2);

	expect(page.getByTestId("created-user-2")).toBeDefined();

	const t2 = await page
		.getByTestId("list-user")
		.nth(0)
		.getByTestId("user-name")
		.textContent();

	expect(t2).toBe("Testing-2");
});
