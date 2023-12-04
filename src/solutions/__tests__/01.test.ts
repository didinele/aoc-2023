import { describe, expect, test } from 'vitest';
import { dayOnePartOne, dayOnePartTwo } from '../01/01.js';

describe('Part 1', () => {
	test('example input', () => {
		const input = ['1abc2', 'pqr3stu8vwx', 'a1b2c3d4e5f', 'treb7uchet'].join('\n');
		expect(dayOnePartOne(input)).toBe(142);
	});
});

describe('Part 2', () => {
	test('example input', () => {
		const input = [
			'two1nine',
			'eightwothree',
			'abcone2threexyz',
			'xtwone3four',
			'4nineeightseven2',
			'zoneight234',
			'7pqrstsixteen',
		].join('\n');
		expect(dayOnePartTwo(input)).toBe(281);
	});
});
