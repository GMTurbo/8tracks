function SplashAssistant(argFromPusher) {
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
	this.loggedin = false;
	this.username = "";
	this.password = "";
	this.type = "recent";
}

SplashAssistant.prototype = {
	setup: function() {
		Ares.setupSceneAssistant(this);
	},
	cleanup: function() {
		Ares.cleanupSceneAssistant(this);
	},
	activate: function() {
		this.$.picture1.setSrc(Mojo.appPath + "images/tracks_01.png");
		this.cookie = new Mojo.Model.Cookie("credentials");
		if (this.cookie.get()) {
			this.username = this.cookie.get().username;
			this.password = this.cookie.get().password;
			this.userid = this.cookie.get().userid;
			if (this.cookie.get().username !== "") {
				this.requestLogin();
			} else {
				this.checkConnection();
			}
		} else {
			this.checkConnection();
		}
	},
	checkConnection: function() {
		this.controller.serviceRequest('palm://com.palm.connectionmanager', {
			method: 'getstatus',
			parameters: {
				subscribe: true
			},
			onSuccess: this.begin.bind(this),
			onFailure: this.error.bind(this)
		});
	},

	requestLogin: function() {
		var onComplete = function(transport) {
			if (transport.responseJSON.status === "200 OK") {
				this.loggedin = true;
				var getUserInfo = function(transport) {
					if(this.cookie.get()){
						if(typeof this.cookie.get().userid === "undefined" && this.cookie.get().username !== ""){
							this.cookie.put({
							username: this.username,
							password: this.password,
							token: transport.responseJSON.auth_token,
							userid: transport.responseJSON.current_user.id
							});
						}
					}
					this.userid = transport.responseJSON.user.id;
					this.begin();
				};
				url = "http://8tracks.com/users/" + this.username + ".json";
				var failure = function(transport) {
					this.popUp("Login Error", "Check Credentials");
					this.begin();
				};
				this.requestDemo(url, getUserInfo.bind(this), failure.bind(this));
			}
		};
		var onFailure = function(transport) {
			this.checkConnection();
		};
		url = "http://8tracks.com/sessions.json";
		var postdata = "login=" + this.username + "&password=" + this.password;
		var myAjax = new Ajax.Request(url, {
			method: "post",
			parameters: postdata,
			onComplete: onComplete.bind(this),
			onFailure: onFailure.bind(this)
		});
	},

	requestDemo: function(url, onComplete, onFailure) {
		var myAjax = new Ajax.Request(url, {
			method: "get",
			evalJSON: 'force',
			contentType: 'application/x-www-form-urlencoded',
			requestHeaders: {
				"USER_AGENT": navigator.userAgent
			},
			onComplete: onComplete,
			onFailure: onFailure
		});
	},
	getDefaultMix: function() {
		cookie3 = new Mojo.Model.Cookie("defaultMix");
		var defmix = "defmix:l";
		if (cookie3.get()) {
			defmix = cookie3.get().defaultMix;
		}
		switch (defmix) {
		case 'defmix:l':
			return "recent";
		case 'defmix:r':
			return "random";
		case 'defmix:h':
			return "hot";
		case 'defmix:p':
			return "popular";
		case 'defmix:liked':
			return "liked";
		case 'defmix:mm':
			return "mine";
		case 'defmix:fol':
			return "recent";
		}
	},
	begin: function(inSender, event) {
		var onComplete = function(transport) {
			if (200 === transport.status) {
				var tracks = transport.responseJSON.mixes;
				this.controller.stageController.swapScene('gridScene', tracks, transport.responseJSON.total_entries, transport.responseJSON.mix_set_id, this.loggedin, this.username, this.password, this.userid, this.type);
			}
		};

		var onFailure = function(transport) {
			this.popUp("Error!", "Could not connect to 8tracks server. Check your connection and try again");
			Mojo.Log.info("Failed to login");
		};
		this.type = this.getDefaultMix();
		var url = "";
		if (this.type === "liked") {
			url = "http://8tracks.com/users/" + this.userid + "/mixes.json?view=liked";
		} else if (this.type === "mine") {
			url = "http://8tracks.com/users/" + this.userid + "/mixes.json";
		} else if (this.type === "featured") {
			url = "http://8tracks.com/mix_sets/featured.json?per_page=10&page=1";
		} else {
			url = "http://8tracks.com/mixes.json?page=1&sort=" + this.type;
		}

		this.requestDemo(url, onComplete.bind(this), onFailure.bind(this));
	},

	push: function(response) {
		if (response.isInternetConnectionAvailable) {
			this.controller.stageController.pushScene({
				'name': 'main',
				transition: Mojo.Transition.zoomFade,
				disableSceneScroller: true
			});
		} else {
			this.popUp("No Network Available", "Unable to connect to a network.");
		}
	},

	error: function(response) {
		this.popUp("No Network Available", "Unable to connect to a network.");
	}
};

SplashAssistant.prototype.handleCommand = function(event) {
	if (event.type == Mojo.Event.back) {
		event.stop();
	}
};