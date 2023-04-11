import { Card } from "@/components/Card";
import { api } from "@/lib/trpc";
import { memo, useState } from "react";
import {
	Button,
	Collapse,
	Input,
	Loading,
	Spacer,
	User,
} from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import Code from "@/components/Code";
import { Tabs } from "@/components/Tabs";
import { CodeIcon } from "@radix-ui/react-icons";
import { orderByFunc } from "@deepakvishwakarma/ts-util";

const Mutation = () => {
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
					const insert = data
						? [
								...data,
								{
									name,
									id: Math.random() * 1000,
									createdAt: new Date(),
								},
						  ]
						: [{ name, id: 0, createdAt: new Date() }];

					return orderByFunc(
						insert,
						["createdAt"],
						(p1: Date, p2: Date) =>
							new Date(p2).getTime() - new Date(p1).getTime(),
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
					<h1 className="text-2xl font-medium">Create user</h1>
					<Button color="secondary" size="xs" onClick={resetAll}>
						Reset
					</Button>
					<Checkbox
						isSelected={optimisticallyUpdate}
						onChange={setOptimisticallyUpdate}
					>
						Optimistically update
					</Checkbox>
				</div>
				<p className="text-gray-500">
					All requests have a delay of 400ms to simulate a real API.
				</p>

				<div className="grid grid-cols-2 gap-6 mt-4 border-solid border-0 border-t pt-4 border-gray-600">
					<form onSubmit={handleSubmit}>
						<Input
							label="User's name"
							type="text"
							name="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter name..."
							required
						/>
						<Spacer />

						<Button type="submit" size="sm" color="primary" shadow>
							Submit
						</Button>
					</form>

					<div className="relative">
						{isMutating && (
							<div className="top-0 left-0 bottom-0 right-0 absolute flex place-items-center">
								<Loading />
							</div>
						)}

						{!isMutating && user && (
							<>
								<p className="text-lg font-medium">Created user</p>
								<Spacer />
								<User
									src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
									name={user.name}
									description={`ID: ${user.id}`}
									squared
									size="xl"
								/>
							</>
						)}
					</div>
				</div>
			</Card>
			<Spacer y={2} />

			<Spacer y={2} />
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
			<div className="grid grid-cols-1 gap-6">
				{users?.map((user) => (
					<User
						key={user.id}
						src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
						name={user.name}
						description={`ID: ${user.id}`}
						squared
						size="md"
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
				<Collapse.Group>
					<Collapse title="Mutating">
						<Code lang="ts">
							{optimisticEnabled ? createUserOptimistic : createUser}
						</Code>
					</Collapse>
					<Collapse title="Loading state">
						<Code lang="tsx">{loadingState}</Code>
					</Collapse>
				</Collapse.Group>
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
