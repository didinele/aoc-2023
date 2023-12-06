import type { Solution } from '../../solution';
import { isDigit } from '../util.js';

export const dayOnePartOne: Solution = (rawInput): number =>
	rawInput
		.split('\n')
		.map((line) => {
			const chars = line.split('');
			return Number(`${chars.find(isDigit)}${chars.findLast(isDigit)}`);
		})
		.reduce<number>((acc, curr) => acc + curr, 0);

const parseTextDigit = (str: string): string | null => {
	const char = str[0]!;
	switch (char) {
		case 'o': {
			return str.slice(1, 3) === 'ne' ? '1' : null;
		}

		case 't': {
			if (str.slice(1, 3) === 'wo') {
				return '2';
			}

			if (str.slice(1, 5) === 'hree') {
				return '3';
			}

			return null;
		}

		case 'f': {
			if (str.slice(1, 4) === 'our') {
				return '4';
			}

			if (str.slice(1, 4) === 'ive') {
				return '5';
			}

			return null;
		}

		case 's': {
			if (str.slice(1, 3) === 'ix') {
				return '6';
			}

			if (str.slice(1, 5) === 'even') {
				return '7';
			}

			return null;
		}

		case 'e': {
			return str.slice(1, 5) === 'ight' ? '8' : null;
		}

		case 'n': {
			return str.slice(1, 4) === 'ine' ? '9' : null;
		}

		default: {
			return null;
		}
	}
};

const parseDigits = (str: string): [string, string] => {
	const parsed = [];

	let index = 0;
	while (index < str.length) {
		if (isDigit(str[index]!)) {
			parsed.push(str[index]!);
			index++;
			continue;
		}

		const digit = parseTextDigit(str.slice(index));
		if (digit) {
			parsed.push(digit);
		}

		index++;
	}

	if (parsed.length === 1) {
		return [parsed[0]!, parsed[0]!];
	}

	return [parsed[0]!, parsed.at(-1)!];
};

// Thoughts: Honestly, weak start to AOC. Disappointed that the input, nor the problem establish that overlap can occur
// E.g. "twone" is to be parsed as 2 and 1, rather than just 2. Would've never crossed my mind.
// Luckily, all I had to do with my solution was get rid of the `index += skip` logic that I had implemented
// (e.g. parseTextDigit would return a tuple of [parsed, skip], and I would increment the index by skip)
// while now I just always increment the index by 1.
export const dayOnePartTwo: Solution = (rawInput): number =>
	rawInput
		.split('\n')
		.map((line) => {
			const [first, second] = parseDigits(line);
			return Number(`${first}${second}`);
		})
		.reduce<number>((acc, curr) => acc + curr, 0);
