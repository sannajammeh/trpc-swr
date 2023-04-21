import { Card } from "@/components/Card";
import { api } from "@/lib/trpc";
import { createSSG } from "@/server/_app";
import { GetStaticProps } from "next";

interface Props {
	status: {
		status: string;
	};
	fallback: Record<string, any>;
}

const SSG = ({ status: initialStatus, fallback }: Props) => {
	const { data } = api.status.useSWR(undefined, {
		fallbackData: initialStatus,
	});

	return (
		<Card>
			<h1 className="text-2xl font-medium mb-2">Static Site Generation</h1>
			<p>Purely static generated using trpc-swr</p>
			<div>
				<p data-testid="initial-status">{initialStatus.status}</p>
				<p data-testid="swr">{data?.status}</p>
			</div>
			<div>
				<p data-testid="fallback">{JSON.stringify(fallback)}</p>
			</div>
		</Card>
	);
};

export default SSG;

export const getStaticProps: GetStaticProps = async () => {
	const ssg = createSSG();

	const status = await ssg.status.fetch();
	ssg.hello.fetch({
		name: "world",
	});

	return {
		props: {
			status,
			fallback: await ssg.dehydrate(),
		},
	};
};
