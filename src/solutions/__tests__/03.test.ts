import { describe, expect, test } from 'vitest';
import { dayThreePartOne } from '../03/03.js';

describe('Part 1', () => {
	test('example input', () => {
		const input = [
			'467..114..',
			'...*......',
			'..35..633.',
			'......#...',
			'617*......',
			'.....+.58.',
			'..592.....',
			'......755.',
			'...$.*....',
			'.664.598..',
		].join('\n');
		expect(dayThreePartOne(input)).toBe(4_361);
	});
});

// describe('Part 2', () => {
// 	// test('example input', () => {
// 	// });
// });
