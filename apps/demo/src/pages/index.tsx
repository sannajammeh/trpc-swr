import { Card } from "@/components/Card";
import Code from "@/components/Code";
import { api } from "@/lib/trpc";
import { Loading } from "@nextui-org/react";

const Home = () => {
	const { data, isLoading } = api.status.useSWR();

	return (
		<Card>
			<h1 className="text-2xl font-medium mb-2">Fetching</h1>
			<>
				{isLoading && !data ? (
					<Loading />
				) : (
					<div>
						Status: <code data-testid="status">{data?.status}</code>
					</div>
				)}
			</>
			<Code lang="ts">{`
const { data } = api.status.useSWR();
			`}</Code>
		</Card>
	);
};

export default Home;
