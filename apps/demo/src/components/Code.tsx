import { stableHash } from "@/utils/stableHash";
import { Loading } from "@nextui-org/react";
import { memo } from "react";
import useSWRImmutable from "swr/immutable";

const Code = ({
	children,
	lang,
}: { children: string; lang: "ts" | "tsx" | "json" }) => {
	const { data: html, isLoading } = useSWRImmutable(
		`/api/code-preview?hash=${String(stableHash(children))}&lang=${lang}`,
		(url: string) => {
			return fetch(url, {
				headers: {
					"content-type": "text/plain",
					// rome-ignore lint/style/noNonNullAssertion: <explanation>
					"x-client-secret": process.env.NEXT_PUBLIC_CLIENT_SECRET!,
				},
				method: "POST",
				body: children,
			}).then((r) => r.text());
		},
	);

	if (isLoading)
		return (
			<div className="aspect-video grid place-content-center">
				<Loading>Generating preview...</Loading>
			</div>
		);
	if (!html) return null;

	return (
		<>
			<div
				className="formatter"
				// rome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: html,
				}}
			/>
			<style jsx>
				{`
			.formatter > :global(pre) {
			background-color: transparent !important;
			padding: unset !important;
			margin: unset !important;
			border-radius: unset;
		  }
		  .formatter > :global(pre) > :global(code) {
			all: unset;
		  }
		`}
			</style>
		</>
	);
};

export default memo(Code);
