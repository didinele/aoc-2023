// Mostly copy pasted from partOne and modified. Would've been too painful to integrate
// the stuff needed for part 2 into the existing code.

import type { Solution } from '../../solution.js';
import { dedupeNonPrimitiveArray, isDigit } from '../util.js';

type MatrixIndex = [number, number];

enum TokenKind {
	Number,
	Gear,
	Other,
}

interface NumberToken {
	id: number;
	kind: TokenKind.Number;
	value: number;
}

type Token = NumberToken | { kind: TokenKind.Gear } | { kind: TokenKind.Other };

interface Schematic {
	// To avoid traversing the entire matrix again
	gearIndeces: MatrixIndex[];
	matrix: Token[][];
}

// We're working with a consistent line length
function createSchematic(rawInput: string): Schematic {
	const matrix: Token[][] = [];
	const gearIndeces: MatrixIndex[] = [];

	let nextNumTokenId = 0;

	for (const rawLine of rawInput.split('\n')) {
		const line: Token[] = [];
		let charIdx = 0;

		while (charIdx < rawLine.length) {
			const char = rawLine[charIdx]!;
			if (isDigit(char)) {
				const startNumberIdx = charIdx;
				while (isDigit(rawLine[charIdx]!)) {
					charIdx++;
				}

				const parsedNumber = Number.parseInt(rawLine.slice(startNumberIdx, charIdx), 10);
				const token: NumberToken = { id: nextNumTokenId++, kind: TokenKind.Number, value: parsedNumber };

				for (let idx = startNumberIdx; idx < charIdx; idx++) {
					line.push(token);
				}
			} else {
				if (char === '*') {
					gearIndeces.push([matrix.length, line.length]);
					line.push({ kind: TokenKind.Gear });
				} else {
					line.push({ kind: TokenKind.Other });
				}

				charIdx++;
			}
		}

		matrix.push(line);
	}

	return { matrix, gearIndeces };
}

function retrieveNearbyNumbers(schematic: Schematic, [row, column]: MatrixIndex): NumberToken[] {
	const nearbyNumbers: NumberToken[] = [];

	for (let currentRow = row - 1; currentRow <= row + 1; currentRow++) {
		for (let currentColumn = column - 1; currentColumn <= column + 1; currentColumn++) {
			const currentToken = schematic.matrix[currentRow]?.[currentColumn];
			if (!currentToken) {
				continue;
			}

			if (currentToken.kind === TokenKind.Number) {
				nearbyNumbers.push(currentToken);
			}
		}
	}

	return nearbyNumbers;
}

export const dayThreePartTwo: Solution = (rawInput): number => {
	const schematic = createSchematic(rawInput);
	let sum = 0;

	for (const [row, column] of schematic.gearIndeces) {
		const dupedNearbyNumbers = retrieveNearbyNumbers(schematic, [row, column]);
		const nearbyNumbers = dedupeNonPrimitiveArray(dupedNearbyNumbers, (number) => number.id);
		if (nearbyNumbers.length !== 2) {
			continue;
		}

		sum += nearbyNumbers.reduce((acc, curr) => acc * curr.value, 1);
	}

	return sum;
};
