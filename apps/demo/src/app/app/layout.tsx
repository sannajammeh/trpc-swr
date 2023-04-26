import { PropsWithChildren } from "react";
import SWRConfig from "../SWRConfig";
import { createSSG } from "@/server/_app";
import { getNotifications } from "./fetchers";

const Layout = async ({ children }: PropsWithChildren<{}>) => {
	const ssg = createSSG();
	// Fetch notifications
	return (
		<SWRConfig
			value={{
				fallback: {
					[ssg.notifications.all.getKey()]: await getNotifications(),
				},
			}}
		>
			{children}
		</SWRConfig>
	);
};

export default Layout;
