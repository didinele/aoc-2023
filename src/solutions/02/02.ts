import type { Solution } from '../../solution';

// this is straight out of the problem
const maxCounts = {
	blue: 14,
	green: 13,
	red: 12,
} as const;

export const dayTwoPartOne: Solution = (rawInput): number =>
	rawInput
		.split('\n')
		.map<[possible: boolean, gameId: number]>((line) => {
			// Game 3: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
			const [game, data] = line.split(': ') as [string, string];
			// Game 3
			const gameId = Number.parseInt(game.split(' ')[1]!, 10);

			const chunks = data.split('; ');
			// A chunk looks like "3 blue, 4 red"
			for (const chunk of chunks) {
				const parts = chunk.split(', ');
				// A part looks like "3 blue"
				for (const part of parts) {
					const [count, color] = part.split(' ') as [string, keyof typeof maxCounts];
					if (Number.parseInt(count, 10) > maxCounts[color]) {
						return [false, gameId];
					}
				}
			}

			return [true, gameId];
		})
		.reduce<number>((acc, [impossible, gameId]) => (impossible ? acc + gameId : acc), 0);

interface Counts {
	blue: number;
	green: number;
	red: number;
}

export const dayTwoPartTwo: Solution = (rawInput): number =>
	rawInput
		.split('\n')
		.map<Counts>((line) => {
			const max = {
				blue: 0,
				green: 0,
				red: 0,
			};

			const [_, data] = line.split(': ') as [string, string];

			const chunks = data.split('; ');
			for (const chunk of chunks) {
				const parts = chunk.split(', ');
				for (const part of parts) {
					const [count, color] = part.split(' ') as [string, keyof Counts];
					max[color] = Math.max(max[color], Number.parseInt(count, 10));
				}
			}

			return max;
		})
		// Calculate "power" as defined in the problem
		.map<number>((counts) => counts.blue * counts.green * counts.red)
		.reduce<number>((acc, curr) => acc + curr, 0);
