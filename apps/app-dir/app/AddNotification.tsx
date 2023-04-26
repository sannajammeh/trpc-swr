"use client";
import Code from "@/components/Code";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/trpc";
import { z } from "zod";

const notificationSchema = z.object({
	title: z.string().min(3),
	body: z.string().min(3),
});

const AddNotification = () => {
	const { toast } = useToast();
	const { trigger, isMutating } = api.notifications.add.useSWRMutation();
	const { mutate: reloadNotifications } = api.notifications.all.useSWR();
	const { client } = api.useContext();

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		try {
			const data = new FormData(e.target as HTMLFormElement);

			const notification = notificationSchema.parse(
				Object.fromEntries(data.entries()),
			);

			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			const result = (await trigger(notification))!;

			await reloadNotifications();

			toast({
				title: "Notification Added",
				action: (
					<ToastAction
						altText="Undo"
						onClick={() =>
							client.notifications.remove
								.mutate(result.id)
								.then(() => reloadNotifications())
						}
					>
						Undo
					</ToastAction>
				),
			});
		} catch (error: any) {
			toast({
				variant: "destructive",
				title: "Error",
				description: error.message,
			});
		}
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					Add Notification <Badge variant="destructive">Client</Badge>
				</CardTitle>
				<CardDescription>
					Mutation to server and update client UI
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="preview">
					<TabsList>
						<TabsTrigger value="preview">UI</TabsTrigger>
						<TabsTrigger value="code">Code</TabsTrigger>
					</TabsList>
					<TabsContent value="preview">
						<form onSubmit={handleSubmit}>
							<Label htmlFor="title">
								<span>Title</span>
								<Input required name="title" id="title" />
							</Label>
							<Label htmlFor="body">
								<span>Body</span>
								<Input required name="body" id="body" />
							</Label>
							<Button type="submit" className="mt-2">
								{isMutating ? "Adding..." : "Add Notification"}
							</Button>
						</form>
					</TabsContent>
					<TabsContent value="code">
						<div>Code</div>
						<Code lang="ts">{addCode}</Code>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};

export default AddNotification;

const addCode = `
const { trigger, isMutating } = api.notifications.add.useSWRMutation();
const { mutate: reloadNotifications } = api.notifications.all.useSWR();

const handleSubmit = async () => {
	// ...

	await trigger(notification);
	await reloadNotifications();
}
`;
