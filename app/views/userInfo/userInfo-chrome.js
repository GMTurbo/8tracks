opus.Gizmo({
	name: "userInfo",
	dropTarget: true,
	type: "Palm.Mojo.Panel",
	t: 0,
	h: 452,
	styles: {
		zIndex: 2,
		bgImage: "images/white-1.jpg"
	},
	chrome: [
		{
			name: "label1",
			label: "",
			type: "Palm.Mojo.Label",
			l: 0,
			t: 0,
			h: 10
		},
		{
			name: "spinner1",
			type: "Palm.Mojo.Spinner",
			l: 0,
			r: "270",
			t: 20
		},
		{
			name: "scroller4",
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
					name: "label2",
					label: "",
					type: "Palm.Mojo.Label",
					l: 0,
					t: 0,
					h: 16
				},
				{
					name: "picture1",
					type: "Palm.Picture",
					l: 95,
					w: 130,
					t: 0,
					h: 117
				},
				{
					name: "group1",
					dropTarget: true,
					label: "Bio",
					type: "Palm.Mojo.Group",
					l: 0,
					t: 133,
					h: 148,
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
								overflow: "hidden"
							},
							controls: [
								{
									name: "label3",
									label: "",
									type: "Palm.Mojo.Label",
									l: 0,
									t: 0
								}
							]
						}
					]
				},
				{
					name: "divider1",
					label: "Mixes",
					type: "Palm.Mojo.Divider",
					l: 0,
					t: 281
				},
				{
					name: "list1",
					dropTarget: true,
					items: [
						{
							item: 0,
							label: "Zero",
							value: "0"
						},
						{
							item: 1,
							label: "One",
							value: "1"
						},
						{
							item: 2,
							label: "Two",
							value: "2"
						},
						{
							item: 3,
							label: "Three",
							value: "3"
						}
					],
					useSampleData: false,
					title: undefined,
					itemHtml: "<div class=\"palm-row grid-cell\"x-mojo-tap-highlight=\"immediate\"> \n  <div class=\"title\"><img src=\"#{leftImage}\" align=\"left\">&nbsp;<font face=\"Arial\">#{title}</font><tag=\"tag\"><br><small><font face=\"helvetica\" color=\"#808080\">&nbsp;#{tag}</font></small></br><mixInfo=\"mixInfo\"><set_id=\"set_id\"></div>  \n</div",
					onlisttap: "list1Listtap",
					type: "Palm.Mojo.List",
					l: 0,
					t: 315,
					h: 297,
					styles: {
						textColor: "white"
					}
				}
			]
		}
	]
});