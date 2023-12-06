import type { Solution } from '../../solution';

function parseCardInfo(line: string): number {
	// 41 48 83 86 17 | 83 86 6 31 17 9 48 53
	const [, data] = line.split(': ') as [string, string];

	const [winningNumbersRaw, numbersRaw] = data.split(' | ') as [string, string];
	const winningNumbers = new Set(winningNumbersRaw.split(' ').map(Number));
	const numbers = numbersRaw.split(' ').map(Number);

	return numbers.filter((number) => winningNumbers.has(number)).length;
}

export const dayFourPartOne: Solution = (rawInput): number => {
	let score = 0;

	// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
	for (const rawLine of rawInput.split('\n')) {
		// Replace multiple consecutive spaces with a single space
		const line = rawLine.replaceAll(/  +/g, ' ');
		const won = parseCardInfo(line);

		if (won > 0) {
			score += 2 ** (won - 1);
		}
	}

	return score;
};

export const dayFourPartTwo: Solution = (rawInput): number => {
	const lines = rawInput.split('\n');
	// This is an array tracking how many copies of each card we have. It gets populated as we go through the input.
	// Should also note there will always be 0 copies of the first card, since a card can only win copies of further cards.
	const copies: number[] = [0];

	// Our line index should always be the Card id - 1
	for (const [line, rawLine] of lines.entries()) {
		const amountOfThisCard = 1 + copies[line]!;
		const won = parseCardInfo(rawLine.replaceAll(/  +/g, ' '));

		for (let inc = 1; inc <= won; inc++) {
			const cardId = line + inc;
			copies[cardId] ??= 0;
			copies[cardId] += amountOfThisCard;
		}

		// If we didn't win anything we still need to add things the next card to the array, otherwise we start
		// getting NaN'ed into infinity
		if (won === 0 && line !== lines.length - 1) {
			copies[line + 1] ??= 0;
		}
	}

	return copies.reduce((acc, cur) => acc + cur + 1, 0);
};
