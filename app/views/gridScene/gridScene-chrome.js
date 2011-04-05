opus.Gizmo({
	name: "gridScene",
	dropTarget: true,
	type: "Palm.Mojo.Panel",
	h: "100%",
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
			h: 13
		},
		{
			name: "spinner1",
			type: "Palm.Mojo.Spinner",
			l: 0,
			r: "270",
			t: 49
		},
		{
			name: "divider1",
			label: "Latest Mixes ( 1/10)",
			type: "Palm.Mojo.Divider",
			l: 0,
			t: 49
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
					itemHtml: "<div class=\"palm-row grid-cell\"x-mojo-tap-highlight=\"immediate\"> \n  <div class=\"title\"><img src=\"#{leftImage}\" align=\"left\">&nbsp;<font face=\"Arial\">#{title}</font><tag=\"tag\"><br><small><font face=\"helvetica\" color=\"#808080\">&nbsp;#{tag}</font></small></br><mixInfo=\"mixInfo\"><set_id=\"set_id\"></div>  \n</div>  \n",
					onlisttap: "list1Listtap",
					swipeToDelete: false,
					reorderable: false,
					type: "Palm.Mojo.List",
					l: 0,
					t: 0,
					h: 108,
					vAlign: "center",
					styles: {
						textColor: "white"
					}
				}
			]
		}
	]
});