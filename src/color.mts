import { ColorParseError, Clamp, ColorOperationError } from './utils.mjs';

export default class Color {
	readonly dimension: number;
	components: number[] = [];

	constructor(components: number[]) {
		this.dimension = components.length;
		for(let i = 0; i < this.dimension; ++i)
			this.SetChannel(i, components[i]);
	}
	static #cssMatch = /^([\-a-zA-Z]+)?\(([^,]+(\,[^,]+)*)\)$/i;
	static FromCssFunc(css: string) {
		css = css.replace(/\s/g, '').toLowerCase();
		const match = Color.#cssMatch.exec(css);
		if(!match)
			throw new ColorParseError(css);
		const func = match![1];
		const args = match![2].split(',');
		switch(func) {
			default: throw new ColorParseError();
			case 'rgb':
				return new Color(args.slice(0, 3).map(x => +x));
		}
	}
	static FromHex(hex: string) {
		if(hex[0] === '#')
			hex = hex.slice(1);
		const components: number[] = [];
		if(hex.length & 1)
			hex = hex.split('').map(x => x.repeat(2)).join('');
		for(let byte: string; byte = hex.slice(0, 2), hex.length; hex = hex.slice(2))
			components.push(parseInt(byte, 16));
		return new Color(components);
	}

	GetChannel(i: number) {
		return this.components[i];
	}
	SetChannel(i: number, value: number) {
		this.components[i] = value;
	}

	Copy() {
		return new Color(this.components);
	}
	Bytewise () {
		return Color.Bytewise(this);
	}

	static #Keys = (color: Color) => Array.from(Array(color.dimension).keys());

	static Equals(a: Color, b: Color) {
		if(a.dimension !== b.dimension)
			return false;
		return Color.#Keys(a).every(i => a.GetChannel(i) === b.GetChannel(i));
	}
	static Difference(a: Color, b: Color) {
		if(a.dimension !== b.dimension)
			return NaN;
		return Color.#Keys(a)
			.map(i => Math.pow(a.GetChannel(i) - b.GetChannel(i), 2))
			.reduce((a, b) => a + b, 0);
	}

	static Map = (fn: (v: number) => number) => (color: Color) => new Color(color.components.map(fn));
	static MapGenerator<T>(fn: (args: T) => (v: number) => number) {
		return (args: T) => Color.Map(fn(args));
	}
	static Blend = (fn: (a: number, b: number) => number) => (a: Color, b: Color) => {
		if(a.dimension !== b.dimension)
			throw new ColorOperationError();
		return new Color(Color.#Keys(a).map(i => fn(a.GetChannel(i), b.GetChannel(i))));
	};
	static BlendGenerator<T>(fn: (args: T) => (a: number, b: number) => number) {
		return (args: T) => Color.Blend(fn(args));
	}

	static Scale = Color.MapGenerator((scalor: number) => (v: number) => scalor * v);
	static Plus = Color.Blend((a: number, b: number) => a + b);
	static AlphaBlend = Color.BlendGenerator((alpha: number) => (a: number, b: number) => alpha * a + (alpha - 1) * b);
	static Bytewise = Color.Map((v: number) => Clamp(v, 0, 0xff) & 0xff);
}
