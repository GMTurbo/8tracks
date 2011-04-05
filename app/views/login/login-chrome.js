opus.Gizmo({
	name: "login",
	dropTarget: true,
	type: "Palm.Mojo.Panel",
	h: "100%",
	styles: {
		zIndex: 2,
		bgImage: "images/white-1.jpg"
	},
	chrome: [
		{
			name: "header1",
			label: "Login Info",
			type: "Palm.Mojo.Header",
			l: 0,
			t: 0
		},
		{
			name: "group1",
			dropTarget: true,
			label: "Username",
			type: "Palm.Mojo.Group",
			l: 0,
			t: 0,
			styles: {
				opacity: 1
			},
			controls: [
				{
					name: "row1",
					dropTarget: true,
					isTextField: true,
					type: "Palm.Mojo.Row",
					l: 0,
					t: 0,
					h: "auto",
					controls: [
						{
							name: "textField1",
							hintText: "",
							type: "Palm.Mojo.TextField"
						}
					]
				}
			]
		},
		{
			name: "group2",
			dropTarget: true,
			label: "password",
			type: "Palm.Mojo.Group",
			l: 0,
			t: 145,
			styles: {
				opacity: 1
			},
			controls: [
				{
					name: "row2",
					dropTarget: true,
					isTextField: true,
					type: "Palm.Mojo.Row",
					l: 0,
					t: 0,
					h: "auto",
					controls: [
						{
							name: "passwordField1",
							hintText: "",
							type: "Palm.Mojo.PasswordField",
							l: 0,
							t: 52
						}
					]
				}
			]
		},
		{
			name: "activityButton1",
			ontap: "activityButton1Tap",
			disabled: undefined,
			label: "Login",
			type: "Palm.Mojo.ActivityButton",
			l: 0,
			t: 240
		}
	]
});