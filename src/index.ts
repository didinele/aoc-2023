import process from 'node:process';
import { Stopwatch } from '@sapphire/stopwatch';
import { resolveInput, resolveSolutions } from './solutions/solutions.js';

const { DAY } = process.env;

if (!DAY) {
	throw new Error('Missing DAY environment variable');
}

const day = Number.parseInt(DAY, 10);

const solutions = resolveSolutions(day);
for (let part = 0; part < 2; part++) {
	const solution = solutions[part];
	if (!solution) {
		console.log('No solution implemented for part 2 yet');
		continue;
	}

	const input = resolveInput(day, part + 1);

	const stopwatch = new Stopwatch();
	const result = await solution(input);

	stopwatch.stop();

	console.log(`Computed result for part ${part + 1}: ${result.toString()}\n	Time: ${stopwatch.toString()}`);
}
