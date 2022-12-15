export class ColorError extends Error {}
export class ColorParseError extends ColorError {}
export class ColorOperationError extends ColorError {}

export function Clamp(x: number, min: number, max: number): number {
	x = Math.max(min, x);
	x = Math.min(max, x);
	return x;
}

type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;
export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
