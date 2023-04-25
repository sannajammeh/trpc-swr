import { Card } from "@/components/Card";
import Code from "@/components/Code";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { User } from "@/components/ui/user";
import { api } from "@/lib/trpc";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWRImmutable from "swr/immutable";

const MutationCard = ({
	throwError,
	setThrowError,
}: { throwError: boolean; setThrowError: (value: boolean) => void }) => {
	const { query } = useRouter();
	const { client } = api.useContext();
	const {
		data: user,
		isMutating,
		trigger,
		error,
		reset,
	} = api.users.create.useSWRMutation({
		throwOnError: false,
	});

	const { data: hasReset } = useSWRImmutable("reset", () => {
		return client.users.reset.mutate();
	});

	const handleReset = async () => {
		await client.users.reset.mutate();
		reset();
	};

	if (!hasReset) {
		return <Card>Waiting for reset...</Card>;
	}

	if (isMutating)
		return (
			<Card>
				<div>
					<span data-testid="loading">Loading...</span>
				</div>
			</Card>
		);

	return (
		<>
			<Card
				data-testid="mutation-card"
				data-test-state={user ? "user-created" : error ? "user-error" : "empty"}
			>
				<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
					Create user
				</h3>
				<div className="flex items-center gap-4 mt-4">
					<Button
						size="sm"
						onClick={() =>
							hasReset &&
							trigger({
								name: (query.name as string) || "John Doe",
								throwError,
							})
						}
					>
						Create User
					</Button>
					<Button onClick={handleReset} size="sm" color="secondary">
						Reset
					</Button>

					<div className="flex items-center gap-1">
						<Checkbox
							id="throw-error"
							checked={throwError}
							onCheckedChange={setThrowError}
							name="throwError"
						/>
						<Label htmlFor="throw-error">Throw error?</Label>
					</div>
				</div>
			</Card>
			{user && (
				<>
					<Card>
						<User
							data-testid="user"
							key={user.id}
							src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
							name={<span data-testid="user-name">{user.name}</span>}
							description={`ID: ${user.id}`}
							squared
						/>
					</Card>
				</>
			)}

			{error && (
				<>
					<Card>
						<h4>Error</h4>
						<pre data-testid="error-message">{error.message}</pre>
					</Card>
				</>
			)}
		</>
	);
};

const SimpleMutation = () => {
	const [throwError, setThrowError] = useState(false);

	return (
		<>
			<MutationCard {...{ throwError, setThrowError }} />
			<Card>
				<h4>Code</h4>
				<Code lang="tsx">{throwError ? handleErrorsCode : codePreview}</Code>
			</Card>
		</>
	);
};

export default SimpleMutation;

const codePreview = `
const { data: user, isMutating, trigger } = api.users.create.useSWRMutation();

if (isMutating) return <Loading data-testid="loading">Loading...</Loading>;

return (
  <>
    <Button onClick={() => trigger({ name: "John Doe" })}>Create User</Button>
    {user && <User name={user.name} description={"ID: " + user.id} />}
  </>
);
`;

const handleErrorsCode = `
const { data: user, isMutating, error, trigger } = api.users.create.useSWRMutation({
  // We have no error catch on trigger() so let SWR handle it
  throwOnError: false, 
});

if (isMutating) return <Loading data-testid="loading">Loading...</Loading>;

if (error) return <pre>{error.message}</pre>

return (
  <>
    <Button onClick={() => trigger({ name: "John Doe" })}>Create User</Button>
    {user && <User name={user.name} description={"ID: " + user.id} />}
  </>
);
`;
