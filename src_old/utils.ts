export function getClientArguments<TPathAndInput extends unknown[], TOptions>(
	pathAndInput: TPathAndInput,
	options: TOptions,
) {
	const [path, input] = pathAndInput
	return [path, input, options] as const
}
