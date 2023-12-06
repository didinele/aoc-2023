import type { Solution } from '../../solution';
import { isDigit } from '../util.js';

type MatrixIndex = [number, number];

enum TokenKind {
	Number,
	Symbol,
	Dot,
}

interface NumberToken {
	id: number;
	kind: TokenKind.Number;
	value: number;
}

type Token = NumberToken | { kind: TokenKind.Dot } | { kind: TokenKind.Symbol };

interface Schematic {
	height: number;
	matrix: Token[][];
	// To avoid traversing the entire matrix again
	symbolIndeces: MatrixIndex[];
	width: number;
}

// We're working with a consistent line length
function createSchematic(rawInput: string): Schematic {
	const matrix: Token[][] = [];
	const symbolIndeces: MatrixIndex[] = [];

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
				if (char === '.') {
					line.push({ kind: TokenKind.Dot });
				} else {
					symbolIndeces.push([matrix.length, line.length]);
					line.push({ kind: TokenKind.Symbol });
				}

				charIdx++;
			}
		}

		matrix.push(line);
	}

	return { matrix, height: matrix.length, width: matrix[0]!.length, symbolIndeces };
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

export const dayThreePartOne: Solution = (rawInput): number => {
	const schematic = createSchematic(rawInput);
	const foundIds = new Set<number>();
	let sum = 0;

	for (const [row, column] of schematic.symbolIndeces) {
		const nearbyNumbers = retrieveNearbyNumbers(schematic, [row, column]);
		for (const nearbyNumber of nearbyNumbers) {
			if (foundIds.has(nearbyNumber.id)) {
				continue;
			}

			foundIds.add(nearbyNumber.id);
			sum += nearbyNumber.value;
		}
	}

	return sum;
};
