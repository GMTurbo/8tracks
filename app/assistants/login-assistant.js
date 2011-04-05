function LoginAssistant(argFromPusher) {
	this.popUp = function(title, message) {
		this.controller.showAlertDialog({
			title: title,
			message: message,
			choices: [
				{
				label: "OK",
				value: "",
				type: 'dismiss'
			}
				]
		});
	};
}

LoginAssistant.prototype = {
	setup: function() {
		Ares.setupSceneAssistant(this);
	},
	cleanup: function() {
		Ares.cleanupSceneAssistant(this);
	},
	showSpinner: function(show) {
		this.controller.get('activityButton1').mojo[(show ? 'activate' : 'deactivate')]();
	},
	activate: function(args) {
		this.cookie2 = new Mojo.Model.Cookie("prefs");
		if (this.cookie2.get()) {
			props = themeLookup(this.cookie2.get().theme);
			this.controller.get('login').style.backgroundImage = props.URL;
			this.$.textField1.style.addStyles({
				textColor: props.textColor
			});
			this.$.passwordField1.style.addStyles({
				textColor: props.textColor
			});
		}
	},

	login: function(username, password) {
		var postdata = "login=" + username + "&password=" + password;

		var myAjax = new Ajax.Request(url, {
			method: "post",
			parameters: postdata,
			onComplete: onComplete,
			onFailure: onFailure
		});
	},

	requestLogin: function(onComplete, onFailure) {
		url = "http://8tracks.com/sessions.json";
		this.username = this.controller.get("textField1").mojo.getValue();
		this.password = this.controller.get("passwordField1").mojo.getValue();

		var postdata = "login=" + this.username + "&password=" + this.password;

		var myAjax = new Ajax.Request(url, {
			method: "post",
			parameters: postdata,
			onComplete: onComplete,
			onFailure: onFailure
		});
	},
	showBanner: function(message) {
		Mojo.Controller.getAppController().showBanner(message, {
			source: 'notification'
		});
	},
	activityButton1Tap: function(inSender, event) {
		this.showSpinner(true);
		var onComplete = function(transport) {
			if (transport.responseJSON.status === "200 OK") {
				this.cookie = new Mojo.Model.Cookie("credentials");
				this.cookie.put({
					username: this.username,
					password: this.password,
					token: transport.responseJSON.auth_token
				});
				this.showBanner("You are now logged in as " + this.username);
				var data = {
					loggedin: true,
					username: this.username,
					password: this.password,
					id: transport.responseJSON.current_user.id
				};
				this.controller.stageController.popScene(data);
			} else {
				this.popUp(tranport.responseJSON.status, transport.responseJSON.statusText);
			}
		};
		var onFailure = function(transport) {
			this.popUp(tranport.responseJSON.status, transport.responseJSON.statusText);
		};
		this.requestLogin(onComplete.bind(this), onFailure.bind(this));
		this.showSpinner(false);
	}
};