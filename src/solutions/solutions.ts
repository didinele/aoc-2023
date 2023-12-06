import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import type { Solution } from '../solution';
import { dayOnePartOne, dayOnePartTwo } from './01/01.js';
import { dayTwoPartOne, dayTwoPartTwo } from './02/02.js';
import { dayThreePartOne, dayThreePartTwo } from './03/03.js';

type SolutionPair = [partOne: Solution, partTwo?: Solution];

export const solutions: Record<number, SolutionPair> = {
	1: [dayOnePartOne, dayOnePartTwo],
	2: [dayTwoPartOne, dayTwoPartTwo],
	3: [dayThreePartOne, dayThreePartTwo],
};

export function resolveInput(day: number, part: number): string {
	const paddedDay = day.toString().padStart(2, '0');
	const inputPath = join(process.cwd(), 'inputs', paddedDay, `${part}.txt`);
	return readFileSync(inputPath, 'utf8');
}

export function resolveSolutions(day: number): SolutionPair {
	const solutionPair = solutions[day];
	if (!solutionPair) {
		throw new Error(`No solutions implemented for day ${day}`);
	}

	return solutionPair;
}
