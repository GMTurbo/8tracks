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
			name: "picture1",
			ontap: "picture1Tap",
			onhold: "picture1Hold",
			type: "Palm.Picture",
			l: 0,
			w: "100%",
			t: 57,
			h: 132
		},
		{
			name: "html1",
			content: "<br><div x-mojo-element=\"ProgressBar\" id=\"progressbarId\" class=\"progressbarClass\" \n name=\"progressbarName\" style=\"padding-left: 7px; padding-right:7px; height;5x;\"></div> <br>",
			type: "Palm.Mojo.Html",
			l: 0,
			t: 200,
			h: "30"
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
					itemHtml: "<div class=\"palm-row grid-cell\"x-mojo-tap-highlight=\"immediate\" style=\"padding:1pt;\"> \n<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/list.css\">\n  <div class=\"title\">\n    <mixInfo=\"mixInfo\">\n    <duration=\"duration\">\n    <currentsong=\"song\">\n    <oldsong=\"song\">\n    <skipped=\"skipped\">\n    <currentartist=\"tag\">\n    <table>\n      <tr>\n        <th id=\"col2\" style=\"width:300px;\">\n          <dt> \n              <div id=\"currentSong\" style=\"font-style:italic;\"> #{currentsong}</div> \n              <div id=\"oldSong\" style=\"font-family:Georgia;\"> #{oldsong} </div>\n              <div id=\"skippedSong\" style=\"font-family:Georgia;\"> #{skipped} </div>\n          </dt>\n          <dt id=\"artistText\"> #{currentartist} </dt>\n          <dt id=\"length\"> #{duration}</dt>\n        </th>\n        <th id=\"col1\">\n            <img src=\"#{likeImage}\" style=\"float:right;\">\n        </th>\n      </tr>\n    </table>\n  </div>  \n</link>\n</div>  \n",
					onlisttap: "list1Listtap",
					swipeToDelete: false,
					reorderable: false,
					type: "Palm.Mojo.List",
					l: 0,
					t: 0,
					h: 212,
					styles: {
						textColor: "black",
						bgImage: ""
					}
				}
			]
		}
	]
});