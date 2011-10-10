opus.Gizmo({
	name: "player",
	dropTarget: true,
	type: "Palm.Mojo.Panel",
	h: "100%",
	styles: {
		zIndex: 2,
		bgImage: "images/white-1.jpg"
	},
	components: [
		{
			name: "audio1",
			autoPlay: true,
			onTimeUpdate: "audio1TimeUpdate",
			type: "Palm.Mojo.Audio"
		},
		{
			name: "sound",
			autoPlay: true,
			audioClass: "defaultapp",
			type: "Palm.Mojo.Audio"
		}
	],
	chrome: [
		{
			name: "label1",
			label: "",
			type: "Palm.Mojo.Label",
			l: 0,
			t: 0,
			h: 8
		},
		{
			name: "spinner1",
			type: "Palm.Mojo.Spinner",
			l: 0,
			r: "270",
			t: 49
		},
		{
			name: "label3",
			label: "",
			type: "Palm.Mojo.Label",
			l: 0,
			t: 39,
			h: 17
		},
		{
			name: "scroller1",
			layoutKind: "hbox",
			mode: "horizontal-snap",
			snapElements: "scroller3,scroller5",
			scrollPosition: {
				left: 0,
				top: 0
			},
			type: "Palm.Mojo.Scroller",
			l: 0,
			t: 57,
			h: 394,
			styles: {
				cursor: "move",
				overflow: "hidden"
			},
			controls: [
				{
					name: "scroller3",
					scrollPosition: {
						left: 0,
						top: 0
					},
					type: "Palm.Mojo.Scroller",
					l: 0,
					w: "320",
					t: 0,
					h: "100%",
					styles: {
						cursor: "move",
						overflow: "hidden",
						bgColor: ""
					},
					controls: [
						{
							name: "html2",
							content: "<style>\n .pic2 {\n    display:block;\n    margin-left:auto;\n    margin-right:auto;\n    height: 100%;\n    -webkit-border-radius:20px;\n    -webkit-transition: -webkit-transform .3s ease-out;\n}\n.pic2:active,.pic2:focus{\n    z-index:10;\n    -webkit-transform:scale(1.2,1.2);\n}\n</style>\n<div x-mojo-touch-feedback=\"immediate\">  \n  <img src=#{pic2} class=\"pic2\"></img>\n</div>",
							ontap: "picture1Tap",
							onhold: "picture1Hold",
							type: "Palm.Mojo.Html",
							l: 0,
							t: 30,
							h: 130
						},
						{
							name: "label2",
							label: "",
							type: "Palm.Mojo.Label",
							l: 0,
							t: 142,
							h: 13
						},
						{
							name: "html1",
							content: "<div x-mojo-element=\"ProgressBar\" id=\"progressbarId\" class=\"progressbarClass\" \n name=\"progressbarName\" style=\"padding-left: 7px; padding-right:7px;\"></div>",
							type: "Palm.Mojo.Html",
							l: 0,
							t: 160,
							h: 18
						},
						{
							name: "divider2",
							label: "tracks",
							type: "Palm.Mojo.Divider",
							l: 0,
							t: 31
						},
						{
							name: "scroller2",
							scrollPosition: {
								left: 0,
								top: 0
							},
							type: "Palm.Mojo.Scroller",
							l: 0,
							t: 195,
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
									itemHtml: "<!--class=\"palm-row grid-cell\" x-mojo-tap-highlight=\"delayed\"--> \n<div class=\"palm-row grid-cell\" style=\"padding:1pt\"> \n<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/list.css\">\n  <div class=\"title\">\n    <mixInfo=\"mixInfo\">\n    <duration=\"duration\">\n    <currentsong=\"song\">\n    <oldsong=\"song\">\n    <skipped=\"skipped\">\n    <currentartist=\"tag\">\n    <table style=\"width:100%\">\n      <tr>\n         <th>\n          <div class=\"grid-cell\" x-mojo-touch-feedback=\"delayed\" style=\"height:100%;border-top:0px\">\n            <id=\"like\">\n              <img src=\"#{likeImage}\" class=\"likeimg\">\n          </div>  \n        </th>\n        <th id=\"col2\" style=\"width:70%\">\n          <dt> \n              <div id=\"currentSong\" style=\"font-style:italic\"> #{currentsong}</div> \n              <div id=\"oldSong\" style=\"font-family:Georgia\"> #{oldsong} </div>\n              <div id=\"skippedSong\" style=\"font-family:Georgia\"> #{skipped} </div>\n          </dt>\n          <dt id=\"artistText\"> #{currentartist} </dt>\n          <dt id=\"length\"> #{duration}</dt>\n        </th>\n        <th>\n          <div class=\"grid-cell\" x-mojo-touch-feedback=\"delayed\" style=\"height:100%;border-top:0px\">\n            <id=\"buy\">\n              <img src=\"#{buyImage}\" class=\"buyimg\">\n           </div>\n        </th>\n      </tr>\n    </table>\n  </div>  \n</link>\n</div>  \n",
									onlisttap: "list1Listtap",
									swipeToDelete: false,
									reorderable: false,
									type: "Palm.Mojo.List",
									l: 0,
									t: 0,
									h: 201,
									styles: {
										textColor: "black",
										bgImage: ""
									}
								},
								{
									name: "label4",
									label: "",
									type: "Palm.Mojo.Label",
									l: 0,
									t: 186
								}
							]
						}
					]
				},
				{
					name: "scroller5",
					scrollPosition: {
						left: 0,
						top: 0
					},
					type: "Palm.Mojo.Scroller",
					l: 0,
					w: "320",
					t: 0,
					h: "100%",
					styles: {
						cursor: "move",
						overflow: "hidden"
					},
					controls: [
						{
							name: "divider10",
							label: "Comments",
							type: "Palm.Mojo.Divider",
							l: 0,
							t: 0
						},
						{
							name: "scroller6",
							scrollPosition: {
								left: 0,
								top: 0
							},
							type: "Palm.Mojo.Scroller",
							l: 0,
							t: 23,
							h: 288,
							styles: {
								cursor: "move",
								overflow: "hidden"
							},
							controls: [
								{
									name: "list2",
									dropTarget: true,
									items: [],
									useSampleData: false,
									title: undefined,
									itemTemplateFile: "templates/comments/CommentItemTemplate",
									itemHtml: "\n",
									listTemplateFile: "templates/comments/CommentContainer",
									renderLimit: "50",
									swipeToDelete: false,
									reorderable: false,
									type: "Palm.Mojo.List",
									l: 0,
									t: 0,
									h: 100
								}
							]
						}
					]
				}
			]
		}
	]
});