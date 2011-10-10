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
			plane: "0",
			type: "Palm.Mojo.Spinner",
			l: 0,
			r: "270",
			t: 10
		},
		{
			name: "scroller1",
			scrollPosition: {
				left: 0,
				top: -241
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
					t: 255,
					h: 134,
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
									name: "scroller3",
									scrollPosition: {
										left: 0,
										top: -9
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
												{}
											],
											useSampleData: false,
											title: undefined,
											itemHtml: "<table style=\"width:100%; height:100%\">\n  <tr>\n    <th>\n      <div x-mojo-touch-feedback=\"delayed\">\n       <id=\"tag1\" style=\"font-size:11pt; background:rgba(0,0,0,0.75); color:white; -webkit-border-radius:5pt; padding:2px; float:center;\">\n          #{tag1}\n      </div>  \n    </th>\n    <th>\n      <div x-mojo-touch-feedback=\"delayed\">\n        <id=\"tag2\" style=\"font-size:11pt; background:rgba(0,0,0,0.75); color:white; -webkit-border-radius:5pt; padding:2px; float:center;\">\n          #{tag2}\n     </div>\n    </th>\n    <th>\n      <div x-mojo-touch-feedback=\"delayed\">\n        <id=\"tag3\" style=\"font-size:11pt; background:rgba(0,0,0,0.75); color:white; -webkit-border-radius:5pt; padding:2px; float:center;\">\n          #{tag3}\n      </div>  \n    </th>\n  </tr>\n</table>\n",
											onlisttap: "list1Listtap",
											swipeToDelete: false,
											reorderable: false,
											rowTapHighlight: false,
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
							name: "row2",
							dropTarget: true,
							rowType: "last",
							type: "Palm.Mojo.Row",
							l: 0,
							t: 52,
							h: "auto",
							controls: [
								{
									name: "html1",
									content: "<img src=#{pic} style=\"-webkit-border-radius: 20px;display:block; margin-left:auto; margin-right:auto; height:100%;\" class=\"pic\"></img>",
									type: "Palm.Mojo.Html",
									l: 0,
									t: 0,
									h: 118
								}
							]
						}
					]
				},
				{
					name: "label4",
					label: "",
					type: "Palm.Mojo.Label",
					l: 0,
					t: 0,
					h: "50"
				}
			]
		}
	]
});