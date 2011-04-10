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
					itemHtml: "<div class=\"palm-row grid-cell\"x-mojo-tap-highlight=\"immediate\" style=\"padding:1pt;\"> \n<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/list.css\">\n  <div class=\"title\">\n    <mixInfo=\"mixInfo\">\n    <set_id=\"set_id\">\n    <tag=\"tag\">\n    <creator=\"creator\">\n    <table style=\"padding:1pt;\">\n    <tr>\n      <th id=\"col1\"><img src=\"#{leftImage}\" class=\"floatleft\"></th>\n      <th id=\"col2\">\n        <dt id=\"titleText\"> #{title} </dt>\n        <dt id=\"tagText\"> #{tag}&nbsp;<i>#{creator}</i></dt>\n      </th>\n    </tr>\n    </table>\n  </div>  \n</link>\n</div>  \n",
					onlisttap: "list1Listtap",
					swipeToDelete: false,
					reorderable: false,
					type: "Palm.Mojo.List",
					l: 0,
					t: 0,
					h: 212,
					styles: {
						textColor: "black"
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