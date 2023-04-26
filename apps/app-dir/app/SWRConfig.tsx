"use client";
import { api } from "@/lib/trpc";

const SWRConfig = ({
	children,
	...rest
}: React.ComponentProps<typeof api.SWRConfig>) => {
	return <api.SWRConfig {...rest}>{children}</api.SWRConfig>;
};

export default SWRConfig;
