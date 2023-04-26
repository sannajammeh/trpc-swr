"use client";
import { cn } from "@/lib/utils";
import { stableHash } from "@/utils/stableHash";
import { memo } from "react";
import useSWRImmutable from "swr/immutable";

const Code = ({
	children,
	lang,
	video,
}: { children: string; lang: "ts" | "tsx" | "json"; video?: boolean }) => {
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
			<div className={cn("grid place-content-center", video && "aspect-video")}>
				<>Generating preview...</>
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
