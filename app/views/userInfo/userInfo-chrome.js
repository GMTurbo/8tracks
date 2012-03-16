opus.Gizmo({
	name: "userInfo",
	dropTarget: true,
	type: "Palm.Mojo.Panel",
	t: 0,
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
					content: "<style>\n .pic {\n    display:block;\n    margin-left:auto;\n    margin-right:auto;\n    height: 100%;\n    -webkit-border-radius:20px;\n    //-webkit-transform:rotate(-5deg);\n    -webkit-transition: -webkit-transform .5s ease-out;\n    border:none;\n}\n.pic:active,.pic:focus{\n    z-index:10;\n    -webkit-transform:rotate(360deg) scale(1.4,1.4);\n}\n</style>\n<div x-mojo-touch-feedback=\"immediate\">  \n  <img src=#{pic} class=\"pic\"></img>\n</div>",
					ontap: "html1Tap",
					type: "Palm.Mojo.Html",
					l: 0,
					t: 16,
					h: 130
				},
				{
					name: "group1",
					dropTarget: true,
					label: "Bio",
					type: "Palm.Mojo.Group",
					l: 0,
					t: 170,
					h: 127,
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
					items: [],
					useSampleData: false,
					title: undefined,
					itemHtml: "\n<div class=\"palm-row grid-cell\" x-mojo-tap-highlight=\"immediate\"> \n<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/list.css\">\n  <div class=\"title\">\n    <mixInfo=\"mixInfo\">\n    <set_id=\"set_id\">\n    <tag=\"tag\">\n    <timeSince=\"timeSince\">\n    <table style=\"padding:1pt;vertical-align:top;\">\n    <tr>\n      <th id=\"col1\"><img src=\"#{leftImage}\" class=\"floatleft\"></th>\n      <th id=\"col2\">\n        <dt id=\"titleText\" style=\"font-size:13pt\"> #{title} </dt>\n        <dt id=\"tagText\"> #{tag} </dt>\n        <dt id=\"time\"> #{timeSince} </dt>\n      </th>\n    </tr>\n    </table>\n  </div>  \n</link>\n</div>   ",
					onlisttap: "list1Listtap",
					swipeToDelete: false,
					reorderable: false,
					type: "Palm.Mojo.List",
					l: 0,
					t: 0,
					h: 100
				},
				{
					name: "label4",
					kind: "title",
					label: "",
					type: "Palm.Mojo.Label",
					l: 0,
					t: 0,
					h: "65",
					hAlign: "center",
					vAlign: "center"
				}
			]
		}
	]
});