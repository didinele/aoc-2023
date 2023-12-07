export interface StringLike {
	toString(): string;
}

export type Solution = (rawInput: string) => Promise<StringLike> | StringLike;
