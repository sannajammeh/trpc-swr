import test from "node:test";
import assert from "node:assert";
import { unstable_serialize, createProxySSGHelpers } from "@trpc-swr/ssg";
import { unstable_serialize as swr_unstable_serialize } from "swr";
import { appRouter } from "../setup.mjs";

test("unstable_serialize", async (t) => {
	await t.test("Should serialize a string key", () => {
		assert.equal(unstable_serialize("/api/users"), "/api/users");
		assert.equal(
			unstable_serialize("01GXTWZRVVFX1VDV8FC46S9280"),
			"01GXTWZRVVFX1VDV8FC46S9280",
		);
	});

	await t.test("Should serialize an array key", () => {
		assert.equal(unstable_serialize(["/api/users"]), `@"/api/users",`);
	});

	await t.test("Should serialize an object key", () => {
		assert.equal(unstable_serialize({ id: 1 }), "#id:1,");
	});

	await t.test("Should match SWR serialization for string", () => {
		assert.equal(
			unstable_serialize("/api/users"),
			swr_unstable_serialize("/api/users"),
		);
	});

	await t.test("Should match SWR serialization for array", () => {
		assert.equal(
			unstable_serialize(["/api/users"]),
			swr_unstable_serialize(["/api/users"]),
		);
	});

	await t.test("Should match SWR serialization for object", () => {
		assert.equal(
			unstable_serialize({ id: 1 }),
			swr_unstable_serialize({ id: 1 }),
		);
	});

	await t.test("Should match SWR serialization for object with array", () => {
		assert.equal(
			unstable_serialize({ id: 1, arr: [1, 2, 3] }),
			swr_unstable_serialize({ id: 1, arr: [1, 2, 3] }),
		);
	});

	await t.test(
		"Should match SWR serialization for array with object and string",
		() => {
			assert.equal(
				unstable_serialize([1, { id: 1 }, "test"]),
				swr_unstable_serialize([1, { id: 1 }, "test"]),
			);
		},
	);
});

const createSSG = () => {
	return createProxySSGHelpers({
		router: appRouter,
		ctx: {},
	});
};

test("createProxySSGHelpers", async (t) => {
	await t.test("Should return a proxy object", () => {
		const ssg = createSSG();

		assert.equal(typeof ssg, "function");
	});

	await t.test("Should access route", async () => {
		const ssg = createSSG();
		const expected_key = '@"hello",';
		assert.equal(typeof ssg.hello, "function");

		assert.equal(ssg.hello.getKey(), expected_key);
	});

	await t.test("Should fetch from procedure", async () => {
		const ssg = createSSG();

		const result = await ssg.hello.fetch();

		assert.equal(result, "world");
	});

	await t.test(
		"Should dehydrate from procedure when paralell fetch",
		async () => {
			const ssg = createSSG();

			ssg.hello.fetch();

			const result = await ssg.dehydrate();

			assert.deepEqual(result, { [ssg.hello.getKey()]: "world" });
		},
	);

	await t.test("Should dehydrate from procedure", async () => {
		const ssg = createSSG();

		const fetchResult = await ssg.hello.fetch();

		assert.equal(fetchResult, "world");

		const result = await ssg.dehydrate();

		assert.deepEqual(result, { [ssg.hello.getKey()]: "world" });
	});
});
