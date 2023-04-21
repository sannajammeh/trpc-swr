import { useRouter } from "next/router";

export function useDelay() {
	const { delay } = useRouter().query;
	const delayMs = typeof delay === "string" ? parseInt(delay) : 0;

	return delayMs;
}
