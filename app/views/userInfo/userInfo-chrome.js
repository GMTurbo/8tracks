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
					name: "html1",
					content: "<img src=#{pic} style=\"-webkit-border-radius: 20px;display:block; margin-left:auto; margin-right:auto; height:100%;\" class=\"pic\"></img>",
					type: "Palm.Mojo.Html",
					l: 0,
					t: 16,
					h: 154
				},
				{
					name: "group1",
					dropTarget: true,
					label: "Bio",
					type: "Palm.Mojo.Group",
					l: 0,
					t: 133,
					h: 148,
					styles: {
						borderColor: ""
					},
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
					itemHtml: "\n<div class=\"palm-row grid-cell\"x-mojo-tap-highlight=\"immediate\"> \n<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/list.css\">\n  <div class=\"title\">\n    <mixInfo=\"mixInfo\">\n    <set_id=\"set_id\">\n    <tag=\"tag\">\n    <timeSince=\"timeSince\">\n    <table style=\"padding:1pt;vertical-align:top;\">\n    <tr>\n      <th id=\"col1\"><img src=\"#{leftImage}\" class=\"floatleft\"></th>\n      <th id=\"col2\">\n        <dt id=\"titleText\" style=\"font-family:Tahoma;font-size:13pt;\"> #{title} </dt>\n        <dt id=\"tagText\"> #{tag} </dt>\n        <dt id=\"time\"> #{timeSince} </dt>\n      </th>\n    </tr>\n    </table>\n  </div>  \n</link>\n</div>   \n",
					onlisttap: "list1Listtap",
					swipeToDelete: false,
					reorderable: false,
					type: "Palm.Mojo.List",
					l: 0,
					t: 315,
					h: 201,
					styles: {
						textColor: "black"
					}
				}
			]
		}
	]
});