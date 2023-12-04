import process from 'node:process';
import { Stopwatch } from '@sapphire/stopwatch';
import { resolveInput, resolveSolution } from './solutions/solutions.js';

const { DAY, PART } = process.env;

if (!DAY || !PART) {
	throw new Error('Missing DAY or PART environment variable');
}

const day = Number.parseInt(DAY, 10);
const part = Number.parseInt(PART, 10);

const solution = resolveSolution(day, part);
const input = resolveInput(day, part);

const stopwatch = new Stopwatch();

const result = solution(input);
stopwatch.stop();

console.log(`Computed result: ${result.toString()}\n	Time: ${stopwatch.toString()}`);
