import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import type { Solution } from '../solution';
import { dayOnePartOne, dayOnePartTwo } from './01/01.js';
import { dayTwoPartOne, dayTwoPartTwo } from './02/02.js';

export const solutions: Record<number, [partOne: Solution, partTwo?: Solution]> = {
	1: [dayOnePartOne, dayOnePartTwo],
	2: [dayTwoPartOne, dayTwoPartTwo],
};

export function resolveInput(day: number, part: number): string {
	const paddedDay = day.toString().padStart(2, '0');
	const inputPath = join(process.cwd(), 'inputs', paddedDay, `${part}.txt`);
	return readFileSync(inputPath, 'utf8');
}

export function resolveSolution(day: number, part: number): Solution {
	const solutionPair = solutions[day];
	if (!solutionPair) {
		throw new Error(`No solutions implemented for day ${day}`);
	}

	const solution = solutionPair[part - 1];
	if (!solution) {
		throw new Error(`No solution implemented for day ${day} part ${part}`);
	}

	return solution;
}
