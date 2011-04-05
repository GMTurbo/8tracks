opus.Gizmo({
	name: "mixDetailsScene",
	dropTarget: true,
	type: "Palm.Mojo.Panel",
	h: "100%",
	styles: {
		zIndex: 2,
		bgImage: "images/white-1.jpg"
	},
	chrome: [
		{
			name: "label3",
			label: "",
			type: "Palm.Mojo.Label",
			l: 0,
			t: 0,
			h: 11
		},
		{
			name: "spinner1",
			type: "Palm.Mojo.Spinner",
			l: 0,
			r: "270",
			t: 10
		},
		{
			name: "scroller1",
			scrollPosition: {
				left: 0,
				top: 0
			},
			type: "Palm.Mojo.Scroller",
			l: 0,
			t: 0,
			h: "100%",
			styles: {
				cursor: "move",
				overflow: "hidden"
			},
			controls: [
				{
					name: "group7",
					dropTarget: true,
					label: "Mix Name",
					type: "Palm.Mojo.Group",
					l: 0,
					t: 0,
					h: 109,
					styles: {
						borderColor: ""
					},
					controls: [
						{
							name: "row1",
							dropTarget: true,
							rowType: "first",
							type: "Palm.Mojo.Row",
							l: 0,
							t: 0,
							h: "auto"
						},
						{
							name: "scroller2",
							scrollPosition: {
								left: 0,
								top: 0
							},
							type: "Palm.Mojo.Scroller",
							l: 0,
							t: 0,
							h: "100%",
							styles: {
								cursor: "move",
								overflow: "hidden"
							},
							controls: [
								{
									name: "name",
									type: "Palm.Mojo.Label",
									l: 8,
									w: 294,
									t: 0,
									h: 65,
									styles: {
										textColor: "",
										fontFamily: "prelude medium"
									}
								}
							]
						}
					]
				},
				{
					name: "group8",
					dropTarget: true,
					label: "Description",
					type: "Palm.Mojo.Group",
					l: 0,
					t: 95,
					h: 146,
					controls: [
						{
							name: "scroller5",
							scrollPosition: {
								left: 0,
								top: 0
							},
							type: "Palm.Mojo.Scroller",
							l: 0,
							t: 0,
							h: "100%",
							styles: {
								cursor: "move",
								overflow: "hidden",
								fontFamily: "prelude medium"
							},
							controls: [
								{
									name: "description",
									type: "Palm.Mojo.Label",
									l: 11,
									w: 291,
									t: "10",
									h: 43,
									styles: {
										textColor: "",
										fontFamily: "prelude medium"
									}
								}
							]
						}
					]
				},
				{
					name: "group9",
					dropTarget: true,
					label: "Tags",
					type: "Palm.Mojo.Group",
					l: 0,
					t: 241,
					h: 99,
					controls: [
						{
							name: "row3",
							dropTarget: true,
							type: "Palm.Mojo.Row",
							l: 0,
							t: 0,
							h: "100%",
							controls: [
								{
									name: "tags",
									kind: "title",
									label: "Tags",
									type: "Palm.Mojo.Label",
									l: 0,
									t: 0,
									h: "100%",
									styles: {
										textColor: "",
										textAlign: "center",
										fontFamily: "prelude medium"
									}
								}
							]
						}
					]
				},
				{
					name: "group1",
					dropTarget: true,
					label: "Created by:",
					type: "Palm.Mojo.Group",
					l: 0,
					t: 340,
					h: 211,
					controls: [
						{
							name: "row4",
							dropTarget: true,
							rowType: "first",
							type: "Palm.Mojo.Row",
							l: 0,
							t: 0,
							controls: [
								{
									name: "creator",
									kind: "title",
									type: "Palm.Mojo.Label",
									l: 7,
									w: 295,
									t: 0,
									styles: {
										textColor: "",
										fontFamily: "prelude medium"
									}
								}
							]
						},
						{
							name: "row6",
							dropTarget: true,
							rowType: "last",
							type: "Palm.Mojo.Row",
							l: 0,
							t: 52,
							h: "auto",
							controls: [
								{
									name: "picture1",
									ontap: "picture1Tap",
									type: "Palm.Picture",
									l: 72,
									w: 150,
									t: 0,
									h: 111
								}
							]
						}
					]
				}
			]
		}
	]
});