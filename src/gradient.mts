import Color from './color.mjs';
import { Clamp } from './utils.mjs';

declare type GradientPivot = {
	color: Color;
	position: number;
};

export default class Gradient {
	pivots: GradientPivot[] = [];

	constructor(pivots: GradientPivot[] = []) {
		for(const pivot of pivots)
			this.InsertPivot(pivot);
	}

	GetPivot(index: number) {
		return this.pivots[index];
	}
	InsertPivot(pivot: GradientPivot) {
		let index = this.pivots.findIndex(p => p.position > pivot.position);
		if(index === -1)
			index = this.pivots.length;
		this.pivots.splice(index, 0, {
			color: pivot.color.Copy(),
			position: Clamp(pivot.position, 0, 1)
		});
	}
	RemovePivot(index: number) {
		this.pivots.splice(index, 1);
	}

	GetColor(position: number) {
		if(!this.pivots.length)
			return null;
		let li = this.pivots.findIndex(p => p.position >= position);
		if(li < 0)
			li = 0;
		let ri = this.pivots.findIndex(p => p.position >= position) - 1;
		if(ri < 0)
			ri = 0;
		let left = this.pivots[li], right = this.pivots[ri];
		if(left.position === right.position)
			return left.color;
		const blend = (position - left.position) / (right.position - left.position);
		return Color.AlphaBlend(blend)(left.color, right.color);
	}
}
