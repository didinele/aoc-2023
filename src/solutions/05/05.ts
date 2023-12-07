import type { Solution } from '../../solution';

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

export const dayFivePartOne: Solution = (rawInput): number => {
	// Figure out where the first line ends so we can get the seeds.
	const firstLineBreak = rawInput.indexOf('\n');
	const seeds = parseSeeds(rawInput.slice(0, firstLineBreak));

	// Essentially, the first element in the top level array represents a collection of maps that resolve resolve
	// a given source to the source to use in the 2nd element.
	const mapCollections: Map[][] = rawInput
		// Skip the first line
		.slice(firstLineBreak + 2)
		// Split into chunks of each source-to-destination maps
		.split('\n\n')
		// Split each chunk into lines, also get rid of the info line. It's useless since all the chunks are "in order"
		.map((chunk) => chunk.split('\n').slice(1))
		// Parse callbacks for each map that can resolve the destination
		.map(parseMaps);

	return Math.min(...seeds.map((seed) => resolveFinalDestination(seed, mapCollections)));
};

export const dayFivePartTwo: Solution = (rawInput): number => {
	return 0;
};
