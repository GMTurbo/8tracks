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
			t: 46,
			h: 17
		},
		{
			name: "picture1",
			ontap: "picture1Tap",
			onhold: "picture1Hold",
			type: "Palm.Picture",
			l: 0,
			w: 321,
			t: 56,
			h: 143
		},
		{
			name: "html1",
			content: "<br><div x-mojo-element=\"ProgressBar\" id=\"progressbarId\" class=\"progressbarClass\" \n name=\"progressbarName\"></div> <br>",
			type: "Palm.Mojo.Html",
			l: 0,
			t: 200,
			h: 32
		},
		{
			name: "divider2",
			label: "tracks",
			type: "Palm.Mojo.Divider",
			l: 0,
			t: 173
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
					itemHtml: "<div class=\"palm-row grid-cell\"x-mojo-tap-highlight=\"immediate\"> \n  <div class=\"title\"><currentsong=\"song\"><oldsong=\"song\"><skipped=\"skipped\">&nbsp;<font face=\"cabin\"><i><b>#{currentsong}</b></i></font><font face=\"Arial\" color=\"#DDDDDD\"><small>#{oldsong}<del>#{skipped}</del></small></font><currentartist=\"tag\"><duration=\"duration\"><img src=\"#{likeImage}\" align=\"right\"><br><small><font face=\"helvetica\" color=\"#808080\">&nbsp;#{currentartist}&nbsp;-&nbsp;#{duration}</font></small><mixInfo=\"mixInfo\"></br></div>\n</div>  \n",
					onlisttap: "list1Listtap",
					swipeToDelete: false,
					reorderable: false,
					type: "Palm.Mojo.List",
					l: 0,
					t: 0,
					h: 285,
					styles: {
						textColor: "black",
						bgImage: ""
					}
				}
			]
		}
	]
});