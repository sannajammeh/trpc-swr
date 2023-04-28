/* eslint-disable unicorn/no-nested-ternary */
type Key = any;
/**
 * @internal - Current SWR helper RIP. This is a temporary solution to bypass Next.js RSC auto compilation error.
 * @source https://github.com/vercel/swr/blob/main/_internal/utils/helper.ts
 */

const noop = () => {};
// prettier-ignore
const UNDEFINED = /*__NOINLINE__*/ noop() as undefined;
const isUndefined = (v: any): v is undefined => v === UNDEFINED;
const isFunction = <
	T extends (...arguments_: any[]) => any = (...arguments_: any[]) => any,
>(
	v: unknown,
	// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
): v is T => typeof v == "function";

const OBJECT = Object;

/**
 * @internal - Current SWR hash RIP. This is a temporary solution to bypass Next.js RSC auto compilation error.
 * @source https://github.com/vercel/swr/blob/main/_internal/utils/hash.ts
 */

// use WeakMap to store the object->key mapping
// so the objects can be garbage collected.
// WeakMap uses a hashtable under the hood, so the lookup
// complexity is almost O(1).
const table = new WeakMap<object, number | string>();

// counter of the key
let counter = 0;

// A stable hash implementation that supports:
// - Fast and ensures unique hash properties
// - Handles unserializable values
// - Handles object key ordering
// - Generates short results
//
// This is not a serialization function, and the result is not guaranteed to be
// parsable.
export const stableHash = (argument: any): string => {
	const type = typeof argument;
	// rome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
	const constructor = argument?.constructor;
	// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
	const isDate = constructor == Date;

	let result: any;
	let index: any;

	// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
	if (OBJECT(argument) === argument && !isDate && constructor != RegExp) {
		// Object/function, not null/date/regexp. Use WeakMap to store the id first.
		// If it's already hashed, directly return the result.
		result = table.get(argument);
		if (result) return result;

		// Store the hash first for circular reference detection before entering the
		// recursive `stableHash` calls.
		// For other objects like set and map, we use this id directly as the hash.
		result = `${++counter}~`;
		table.set(argument, result);

		// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
		if (constructor == Array) {
			// Array.
			result = "@";
			for (index = 0; index < argument.length; index++) {
				result += `${stableHash(argument[index])},`;
			}
			table.set(argument, result);
		}
		// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
		if (constructor == OBJECT) {
			// Object, sort keys.
			result = "#";
			const keys = OBJECT.keys(argument).sort();
			while (!isUndefined((index = keys.pop() as string))) {
				if (!isUndefined(argument[index])) {
					result += `${index}:${stableHash(argument[index])},`;
				}
			}
			table.set(argument, result);
		}
	} else {
		result = isDate
			? argument.toJSON()
			: // rome-ignore lint/suspicious/noDoubleEquals: <explanation>
			type == "symbol"
			? argument.toString()
			: // rome-ignore lint/suspicious/noDoubleEquals: <explanation>
			type == "string"
			? JSON.stringify(argument)
			: `${argument}`;
	}

	return result;
};

export const serialize = (key: Key): [string, Key] => {
	if (isFunction(key)) {
		try {
			key = key();
		} catch {
			// dependencies not ready
			key = "";
		}
	}

	// Use the original key as the argument of fetcher. This can be a string or an
	// array of values.
	const arguments_ = key;

	// If key is not falsy, or not an empty array, hash it.
	key =
		// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
		typeof key == "string"
			? key
			: (Array.isArray(key) ? key.length : key)
			? stableHash(key)
			: "";

	return [key, arguments_];
};

export const unstable_serialize = (key: Key) => serialize(key)[0];
