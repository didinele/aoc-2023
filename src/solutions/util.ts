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

interface RangeOptions {
	end: number;
	start: number;
	step?: number;
}

export function* range(range: RangeOptions | number): Generator<number> {
	let rangeEnd: number;
	let start = 0;
	let step = 1;

	if (typeof range === 'number') {
		rangeEnd = range;
	} else {
		start = range.start;
		rangeEnd = range.end;
		step = range.step ?? 1;
	}

	for (let index = start; index < rangeEnd; index += step) {
		yield index;
	}
}
