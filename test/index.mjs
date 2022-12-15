import Color from '../src/color.mts';
import Gradient from '../src/gradient.mts';

/** @type{ HTMLCanvasElement } */
const cvs = document.getElementById('cvs');
const [w, h] = [cvs.width, cvs.height];
const ctx = cvs.getContext('2d');

{	// Different constructing methods
	const a = Color.FromCssFunc('rgb(255, 255, 255)');
	const b = Color.FromHex('#fff');
	const c = new Color([255, 255, 255]);
	const d = new Color([256, 256, 256]).Bytewise();
	console.assert(Color.Equals(a, b));
	console.assert(Color.Equals(b, c));
	console.assert(Color.Equals(c, d));
}

{	// Mapping & blending
	const a = new Color([1, 1, 1]);
	const b = new Color([0, 0, 0]);
	console.assert(Color.Equals(
		Color.Scale(.5)(a),
		Color.AlphaBlend(.5)(a, b)
	));
}

{	// Gradient
	const gradient = new Gradient([
		{ color: Color.FromHex('#000'), position: 0.0 },
		{ color: Color.FromHex('#026'), position: 0.1 },
		{ color: Color.FromHex('#846'), position: 0.2 },
		{ color: Color.FromHex('#e86'), position: 0.5 },
		{ color: Color.FromHex('#fc8'), position: 0.8 },
		{ color: Color.FromHex('#fff'), position: 1.0 },
	]);
	const zero = new Color([0, 0, 0]);

	ctx.strokeStyle = 'black';
	ctx.beginPath();
	for(let i = 0; i < 1; i += .01) {
		const color = gradient.GetColor(i);
		ctx.lineTo(i * w, h - .2 * Color.Distance(color, zero));
	}
	ctx.stroke();

	ctx.strokeStyle = 'red';
	ctx.beginPath();
	for(let i = 0; i < 1; i += .01) {
		const blending = gradient.GetBlending(i);
		ctx.lineTo(i * w, h * (1 - blending.blend));
	}
	ctx.stroke();
}
