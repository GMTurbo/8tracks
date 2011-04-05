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
}

function toggleLoading(onOff){
	if (onOff == "on"){
		$('loading').show();
	}else{
		$('loading').hide();
	}
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
			if(this.cookie.get().username !== ""){
				this.requestLogin();
				}
				else{
				this.checkConnection();
				}
		}else{
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
		var onComplete = function(transport){
			if(transport.responseJSON.status === "200 OK"){
				this.loggedin = true;
				var getUserInfo = function(transport){
					this.userid = transport.responseJSON.user.id;
					this.begin();
				};
				url = "http://8tracks.com/users/" + this.username + ".json";
				var failure = function(transport){
					this.popUp("Login Error","Check Credentials");
					this.begin();
				};
				this.requestDemo(url,getUserInfo.bind(this), failure.bind(this));
				}
		};
		var onFailure = function(transport){
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

	begin: function(inSender, event) {
		var onComplete = function(transport) {
			if (200 === transport.status) {
				var tracks = transport.responseJSON.mixes;
				this.controller.stageController.swapScene('gridScene', tracks, transport.responseJSON.total_entries, transport.responseJSON.mix_set_id, this.loggedin, this.username, this.password, this.userid);
			}
		};

		var onFailure = function(transport) {
			this.popUp("Error!","Could not connect to 8tracks server. Check your connection and try again");
			Mojo.Log.info("Failed to login");
		};

		var url = "http://8tracks.com/mixes.json?sort=recent";
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

SplashAssistant.prototype.handleCommand = function(event){
	if(event.type == Mojo.Event.back){
		event.stop();
	}
};