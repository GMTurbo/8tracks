opus.Gizmo({
	name: "splash",
	dropTarget: true,
	type: "Palm.Mojo.Panel",
	l: 0,
	r: 0,
	w: 320,
	b: 0,
	h: 452,
	styles: {
		zIndex: 2,
		bgImage: "images/blue.jpg"
	},
	chrome: [
		{
			name: "label1",
			label: "",
			type: "Palm.Mojo.Label",
			l: 0,
			t: 0,
			h: 91
		},
		{
			name: "picture1",
			type: "Palm.Picture",
			l: "10",
			r: "10",
			w: "80%",
			t: 0,
			h: 234
		}
	]
});