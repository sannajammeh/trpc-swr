import { Card } from "@/components/Card";
import Code from "@/components/Code";
import { api } from "@/lib/trpc";

const Home = () => {
	const { data } = api.status.useSWR();

	return (
		<Card>
			<h1 className="text-2xl font-medium mb-2">Fetching</h1>
			<Code lang="ts">{`
const { data } = api.status.useSWR();
			`}</Code>
			<Code lang="json">
				{`
// Response
${JSON.stringify(data, null, 2)}
				`}
			</Code>
		</Card>
	);
};

export default Home;
