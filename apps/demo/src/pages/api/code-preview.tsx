import { NextApiRequest, NextApiResponse } from "next";
import { getHighlighter } from "shiki";

export default async function handler(
	request: NextApiRequest,
	res: NextApiResponse,
) {
	if (request.method !== "POST")
		return res.status(405).send("Method not allowed");

	const CLIENT_SECRET = request.headers["x-client-secret"];

	if (CLIENT_SECRET !== process.env.NEXT_PUBLIC_CLIENT_SECRET)
		return res.status(403).send("Unauthorized");

	if (!request.query.hash) return res.status(400).send("Missing hash");

	const text = request.body as string;
	const lang = (request.query.lang as string) || "ts";

	const highlighter = await getHighlighter({
		theme: "material-theme-palenight",
	});

	const code = highlighter.codeToHtml(text.trim(), { lang });

	res.setHeader("Content-Type", "text/html");
	res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
	res.status(200).send(code);
}
