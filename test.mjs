import Color from './build/color.mjs';
import Gradient from './build/gradient.mjs';

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
		{ color: Color.FromHex('#000'), position: 0 },
		{ color: Color.FromHex('#484'), position: .5 },
		{ color: Color.FromHex('#fff'), position: 1 },
	]);
	console.assert(Color.Equals(gradient.GetColor(.25), Color.FromHex('#242')));
}
