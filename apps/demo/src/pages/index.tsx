import { Card } from "@/components/Card";
import Code from "@/components/Code";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/trpc";

const Home = () => {
	const { data, isLoading } = api.status.useSWR();

	return (
		<Card>
			<h1 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2">
				Fetching
			</h1>
			<>
				{isLoading && !data ? (
					<Skeleton className="w-24 h-8" />
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
