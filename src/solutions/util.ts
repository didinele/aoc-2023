export const isDigit = (char: string): boolean => char >= '0' && char <= '9';

// Maybe there's a faster way to do this?
export function dedupeNonPrimitiveArray<T, TIdentifier extends number | string>(
	array: T[],
	TToIdentifier: (element: T) => TIdentifier,
): T[] {
	const map = new Map<TIdentifier, T>();
	for (const element of array) {
		map.set(TToIdentifier(element), element);
	}

	return [...map.values()];
}
