import { createSSG } from "@/server/_app";
import { cache } from "react";

export const getNotifications = cache(async () => {
	const ssg = createSSG();

	return await ssg.notifications.all.fetch();
});
