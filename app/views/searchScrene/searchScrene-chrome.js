opus.Gizmo({
	name: "searchScrene",
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
			name: "divider1",
			label: "just type",
			type: "Palm.Mojo.Divider",
			l: 0,
			t: 0
		},
		{
			name: "textField3",
			autoHeight: false,
			autoFocus: true,
			hintText: "search",
			focusMode: "select",
			onchange: "textField3Change",
			type: "Palm.Mojo.TextField",
			l: 0,
			t: 34,
			styles: {
				bgColor: "",
				bgImage: ""
			}
		},
		{
			name: "divider2",
			label: "page 1/10",
			type: "Palm.Mojo.Divider",
			l: 0,
			t: 78
		},
		{
			name: "scroller1",
			ontap: "",
			onchange: "",
			scrollPosition: {
				left: 0,
				top: 0
			},
			type: "Palm.Mojo.Scroller",
			l: 0,
			t: 120,
			h: 292,
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
					h: 285,
					styles: {
						textColor: "white"
					}
				}
			]
		},
		{
			name: "spinner1",
			type: "Palm.Mojo.Spinner",
			l: 0,
			r: "270",
			t: 391
		}
	]
});