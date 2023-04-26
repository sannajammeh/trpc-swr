import { z } from "zod";
import { publicProcedure, router } from "./server";
import { TRPCError } from "@trpc/server";

const DUMMY_NOTIFICATIONS = [
	{
		id: 1,
		title: "Notification 1",
		body: "This is the first notification",
		createdAt: new Date(),
	},
	{
		id: 2,
		title: "Notification 2",
		body: "This is the second notification",
		createdAt: new Date(),
	},
	{
		id: 3,
		title: "Notification 3",
		body: "This is the third notification",
		createdAt: new Date(),
	},
	{
		id: 4,
		title: "Notification 4",
		body: "This is the fourth notification",
		createdAt: new Date(),
	},
	{
		id: 5,
		title: "Notification 5",
		body: "This is the fifth notification",
		createdAt: new Date(),
	},
	{
		id: 6,
		title: "Notification 6",
		body: "This is the sixth notification",
		createdAt: new Date(),
	},
	{
		id: 7,
		title: "Notification 7",
		body: "This is the seventh notification",
		createdAt: new Date(),
	},
];

export const notificationsRouter = router({
	all: publicProcedure.query(async () => [...DUMMY_NOTIFICATIONS].reverse()),

	add: publicProcedure
		.input(
			z.object({
				title: z.string(),
				body: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const notification = {
				id: DUMMY_NOTIFICATIONS.length + 1,
				createdAt: new Date(),
				...input,
			};

			DUMMY_NOTIFICATIONS.push(notification);

			return notification;
		}),
	remove: publicProcedure
		.input(z.number())
		.mutation(async ({ input: toastId }) => {
			const index = DUMMY_NOTIFICATIONS.findIndex(
				(toast) => toast.id === toastId,
			);

			if (index === -1) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: `Toast with id ${toastId} not found`,
				});
			}

			DUMMY_NOTIFICATIONS.splice(index, 1);

			return toastId;
		}),
});
