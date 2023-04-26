import Code from "@/components/Code";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSSG } from "@/server/_app";
import ClientNotifications from "./ClientNotifications";
import { getNotifications } from "./fetchers";
import { Badge } from "@/components/ui/badge";
import { Code as CodeIcon } from "lucide-react";
import AddNotification from "./AddNotification";
import Notification from "./Notification";

const Page = async () => {
	const ssg = createSSG();
	const status = await ssg.status.fetch();

	const notifications = await getNotifications();
	return (
		<div className="container py-12">
			<div className="grid grid-cols-[2fr_1fr] mx-auto gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							Notifications <Badge variant="blue">RSC</Badge>
						</CardTitle>
						<CardDescription>Fetching data directly</CardDescription>
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
								<div data-testid="ssg-notifications">
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
									<ScrollArea className="w-full max-w-full">
										<Code lang="ts">{notificationPreview}</Code>
									</ScrollArea>
								</div>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							Status <Badge variant="blue">RSC</Badge>
						</CardTitle>
						<CardDescription>Fetching data directly</CardDescription>
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
								<div data-testid="status">status: {status.status}</div>
							</TabsContent>
							<TabsContent className="w-full" value="code">
								<div>
									<Code lang="ts">{statusPreview}</Code>
								</div>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
				<ClientNotifications />
				<AddNotification />
			</div>
		</div>
	);
};

export default Page;

const statusPreview = `
const ssg = createSSG();

const status = await ssg.status.fetch();

return <>status: {status.status}</>
`;

const notificationPreview = `
const ssg = createSSG();

const notifications = await ssg.notifications.all.fetch();

return (
	<div>
		{notifications.map((notification, index) => (
			<Notification notification={notification} key={notification.id} />
		))}
	</div>
);
`;
