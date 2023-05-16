import { Card } from "@/components/Card";
import { api } from "@/lib/trpc";
import { memo, useState } from "react";
import Code from "@/components/Code";
import { Tabs } from "@/components/Tabs";
import { CodeIcon } from "@radix-ui/react-icons";
import { orderByFunc } from "@deepakvishwakarma/ts-util";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/components/ui/user";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

const Mutation = () => {
	const { delay } = useRouter().query;

	const [optimisticallyUpdate, setOptimisticallyUpdate] = useState(false);
	const [name, setName] = useState("");
	const {
		data: user,
		trigger,
		isMutating,
		reset,
	} = api.users.create.useSWRMutation();

	const { trigger: removeUsers } = api.users.reset.useSWRMutation();

	const { mutate } = api.users.all.useSWR();

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		const updatePromise = trigger(
			{
				name,
				delayMs: Number(delay) || 0,
			},
			{
				optimisticData: {
					name,
				},
			},
		);

		if (optimisticallyUpdate) {
			await mutate(updatePromise as any, {
				populateCache: false,
				optimisticData: (data) => {
					const insert = data?.length
						? [
								...data,
								{
									name,
									id: data[0].id + 1,
									createdAt: new Date(),
								},
						  ]
						: [{ name, id: 0, createdAt: new Date() }];

					return orderByFunc(
						insert,
						["id"],
						(p1: number, p2: number) => p2 - p1,
					);
				},
			});
		} else {
			await updatePromise;
			mutate();
		}

		setName("");
	};

	const resetAll = async () => {
		const updatePromise = removeUsers();
		if (optimisticallyUpdate) {
			reset();
			await mutate(updatePromise as any, {
				populateCache: false,
				optimisticData: () => [],
			});
		} else {
			await updatePromise;
			mutate();
			reset();
		}
	};

	return (
		<>
			<Card>
				<div className="flex gap-4 items-center">
					<h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
						Create user
					</h1>
					<Button size="sm" onClick={resetAll}>
						Reset
					</Button>
					<div className="flex items-center gap-2">
						<Checkbox
							id="optimistic"
							onCheckedChange={setOptimisticallyUpdate as any}
							checked={optimisticallyUpdate}
						/>
						<Label htmlFor="optimistic">Optimistically update</Label>
					</div>
				</div>
				<p className="text-gray-500">
					All requests have a delay of 400ms to simulate a real API.
				</p>

				<div className="grid grid-cols-2 gap-6 mt-4 border-solid border-0 border-t pt-4 border-gray-600">
					<form onSubmit={handleSubmit}>
						<Input
							type="text"
							name="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter name..."
							required
						/>

						<Button className="mt-4" type="submit" size="sm" color="primary">
							Submit
						</Button>
					</form>

					<div className="relative">
						{isMutating && (
							<div className="top-0 left-0 bottom-0 right-0 absolute flex place-items-center">
								<Skeleton />
							</div>
						)}

						{!isMutating && user && (
							<>
								<p className="text-lg font-medium">Created user</p>

								<User
									data-testid={`created-user-${user.id}`}
									src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
									name={user.name}
									description={`ID: ${user.id}`}
									squared
								/>
							</>
						)}
					</div>
				</div>
			</Card>
			{/* <Spacer y={2} /> */}

			{/* <Spacer y={2} /> */}
			<Card>
				<Tabs>
					<Tabs.List>
						<Tabs.Item>Users</Tabs.Item>
						<Tabs.Item>
							<span className="items-center flex gap-1">
								<CodeIcon /> Code
							</span>
						</Tabs.Item>
					</Tabs.List>
					<Tabs.Content>
						<UsersCard />
					</Tabs.Content>
					<Tabs.Content>
						<Codes optimisticEnabled={optimisticallyUpdate} />
					</Tabs.Content>
				</Tabs>
			</Card>
		</>
	);
};

export default Mutation;

const UsersCard = () => {
	const { data: users } = api.users.all.useSWR();

	return (
		<>
			<div className="flex gap-4 mt-2 items-center">
				<h1 className="text-2xl font-medium">All users</h1>
			</div>
			<div className="grid grid-cols-1 gap-6" data-testid="users-list">
				{users?.map((user) => (
					<User
						data-testid="list-user"
						data-user={user.id}
						key={user.id}
						src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
						name={<span data-testid="user-name">{user.name}</span>}
						description={`ID: ${user.id}`}
						squared
					/>
				))}
			</div>
		</>
	);
};

// Codes

const Codes = memo<{ optimisticEnabled?: boolean }>(
	({ optimisticEnabled = false }) => {
		return (
			<div>
				<Accordion type="single" collapsible>
					<AccordionItem value="mutating">
						<AccordionTrigger>Mutating</AccordionTrigger>
						<AccordionContent>
							<Code lang="ts">
								{optimisticEnabled ? createUserOptimistic : createUser}
							</Code>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="loading">
						<AccordionTrigger>Loading state</AccordionTrigger>
						<AccordionContent>
							<Code lang="tsx">{loadingState}</Code>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		);
	},
);

const createUser = `
const { data: user, trigger, isMutating, reset } = api.users.create.useSWRMutation();
const { mutate: updateUsers } = api.users.all.useSWR();

const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
  e.preventDefault();

  await trigger({
	name, // From form input
  });

  updateUsers(); // Update cache of all users
};
`;

const createUserOptimistic = `
const { data: user, trigger, isMutating, reset } = api.users.create.useSWRMutation();
const { mutate: updateUsers } = api.users.all.useSWR();

const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
  e.preventDefault();

  const updatePromise = trigger({ // Notice no await
  	name, // From form input
  });

  await updateUsers(updatePromise as any, {
  	populateCache: false, // Don't update with updatePromise data as its just a single user
  	optimisticData: (data) => 
  		data ? [...data, { name, id: 0 }] : [{ name, id: 0 }], // Add new user to cache
  });
};
`;

const loadingState = `
const { isMutating, ... } = api.users.create.useSWRMutation();

if(isMutating) return <Loading />
`;
