import { once } from 'node:events';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { Worker, isMainThread, workerData, parentPort } from 'node:worker_threads';
import type { Solution } from '../../solution.js';
import { chunkArray, range as computeRange } from '../util.js';

function parseSeeds(line: string): number[] {
	// seeds: x y z
	const [, seeds] = line.split(': ') as [string, string];
	return seeds.split(' ').map(Number);
}

// Returns null if the source is not in the range of the map.
type Map = (source: number) => number | null;

function applyMapCollection(source: number, collection: Map[]): number | null {
	for (const map of collection) {
		const result = map(source);
		if (result !== null) {
			return result;
		}
	}

	// If we get here, the source is not in the range of any of the maps.
	return null;
}

function resolveFinalDestination(source: number, collections: Map[][]): number {
	let nextDestination = source;

	for (const collection of collections) {
		const computed = applyMapCollection(nextDestination, collection);
		// If this is not null, it means we successfully mapped to a new destination, otherwise our map is just f(x)=x.
		if (computed !== null) {
			nextDestination = computed;
		}
	}

	return nextDestination;
}

function parseMaps(lines: string[]): Map[] {
	return lines.map<Map>((line) => {
		const [destinationStart, sourceStart, range] = line.split(' ').map(Number) as [number, number, number];

		const sourceEnd = sourceStart + range - 1;
		const difference = sourceStart - destinationStart;

		return (source: number): number | null => {
			if (source < sourceStart || source > sourceEnd) {
				return null;
			}

			return source - difference;
		};
	});
}

function parseMapCollections(rawInput: string): Map[][] {
	// Essentially, the first element in the top level array represents a collection of maps that resolve resolve
	// a given source to the source to use in the 2nd element.
	return (
		rawInput
			// Split into chunks of each source-to-destination maps
			.split('\n\n')
			// Split each chunk into lines, also get rid of the info line. It's useless since all the chunks are "in order"
			.map((chunk) => chunk.split('\n').slice(1))
			// Parse callbacks for each map that can resolve the destination
			.map(parseMaps)
	);
}

// This could be heavily optimized further by properly chunking the inputs. but this has been hilarious enough
export const dayFivePartTwo: Solution = async (rawInput): Promise<number> => {
	const firstLineBreak = rawInput.indexOf('\n');
	const seedRanges = chunkArray(parseSeeds(rawInput.slice(0, firstLineBreak)), 2) as [number, number][];

	const workers: Worker[] = Array.from(
		{ length: seedRanges.length },
		(_, index) =>
			new Worker(fileURLToPath(import.meta.url), {
				workerData: {
					rawInput,
					range: seedRanges[index],
				},
			}),
	);
	const responses = (await Promise.all(workers.map(async (worker) => once(worker, 'message')))) as [number][];
	return Math.min(...responses.flat());
};

function doWork() {
	const {
		rawInput,
		range: [start, range],
	} = workerData as { range: [number, number]; rawInput: string };

	let min = Number.POSITIVE_INFINITY;
	// We can't send callback functions to workers, so we have to do this here.
	const mapCollections = parseMapCollections(rawInput);

	for (const seed of computeRange({ start, end: start + range })) {
		const destination = resolveFinalDestination(seed, mapCollections);
		if (destination < min) {
			min = destination;
		}
	}

	parentPort!.postMessage(min);
	process.exit(0);
}

if (!isMainThread && process.env.VITEST !== 'true') {
	doWork();
}
