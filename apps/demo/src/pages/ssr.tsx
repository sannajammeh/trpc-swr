import { Card } from "@/components/Card";
import { api } from "@/lib/trpc";
import { createSSG } from "@/server/_app";
import { useDelay } from "@/useDelay";
import { GetServerSideProps } from "next";
import { SWRConfig } from "swr";

interface Props {
	status: {
		status: string;
	};
	fallback: Record<string, any>;
}

const SSR = ({ status: initialStatus, fallback }: Props) => {
	const delayMs = useDelay();
	const { data } = api.status.useSWR(delayMs, {
		fallbackData: initialStatus,
	});

	return (
		<Card>
			<h1 className="text-2xl font-medium mb-2">Server side rendering</h1>
			<div data-testid="props">
				<p data-testid="initial">{initialStatus.status}</p>
				<p data-testid="swr">{data?.status}</p>
			</div>
			<NoFallback />
			<SWRConfig value={{ fallback }}>
				<Inner />
			</SWRConfig>
		</Card>
	);
};

const Inner = () => {
	const delay = useDelay();
	const { data } = api.hello.useSWR({ name: "world", delay });

	return (
		<div data-testid="fallback">
			<p data-testid="swr">{data?.hello}</p>
		</div>
	);
};

const NoFallback = () => {
	const delay = useDelay();
	const { data } = api.hello.useSWR({ name: "world", delay });

	return (
		<div data-testid="no-fallback">
			<p data-testid="swr">{data?.hello ?? "waiting"}</p>
		</div>
	);
};

export default SSR;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const delay = context.query.delay;
	const delayMs = typeof delay === "string" ? parseInt(delay) : 0;
	const ssg = createSSG();

	const status = await ssg.status.fetch();
	ssg.hello.fetch({
		name: "world",
		delay: delayMs,
	});

	return {
		props: {
			status,
			fallback: await ssg.dehydrate(),
		},
	};
};
