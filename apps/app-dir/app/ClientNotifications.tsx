"use client";

import Code from "@/components/Code";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api } from "@/lib/trpc";
import { Code as CodeIcon } from "lucide-react";
import Notification from "./Notification";

const ClientNotifications = () => {
	const { data: notifications, isValidating } = api.notifications.all.useSWR();

	if (!notifications) throw new Error("Notifications did not render");

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					Notifications <Badge variant="destructive">Client</Badge>
					{isValidating && <Badge variant="secondary">Loading...</Badge>}
				</CardTitle>
				<CardDescription>Data fed into global SWR Cachce</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="preview">
					<TabsList>
						<TabsTrigger value="preview">Preview</TabsTrigger>
						<TabsTrigger className="flex items-center gap-2" value="code">
							<CodeIcon size="16" /> Code
						</TabsTrigger>
					</TabsList>
					<TabsContent value="preview">
						<div data-testid="client-notifications">
							<ScrollArea className="h-72 py-3">
								{notifications.map((notification) => (
									<Notification
										key={notification.id}
										notification={notification}
									/>
								))}
							</ScrollArea>
						</div>
					</TabsContent>
					<TabsContent className="w-full" value="code">
						<div className="w-full py-4">
							<ScrollArea className="w-full h-72 max-w-full">
								<Code lang="ts">{notificationPreview}</Code>
							</ScrollArea>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};

export default ClientNotifications;

const notificationPreview = `
// Layout.tsx (RSC)
const ssg = createSSG();

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

// ClientNotifications.tsx
const { data: notifications } = api.notifications.all.useSWR();

if (!notifications) throw new Error("Notifications did not render");

return (
	<div>
		{notifications.map((notification, index) => (
			<Notification notification={notification} key={notification.id} />
		))}
	</div>
);
`;
