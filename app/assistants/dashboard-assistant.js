
var DashboardAssistant = function(musicPlayer) {
	this.musicPlayer = musicPlayer;
	this.toggle = false;
	// if there isn't anything in the musicPlayer, don't open up the dashboard
	if (this.musicPlayer === 0) {
		Mojo.Controller.getAppController().closeStage('dashboard');
	} else if(this.musicPlayer.audio() === 0){
		Mojo.Controller.getAppController().closeStage('dashboard');
	}

	this.appController = Mojo.Controller.getAppController();
	this.locked = false;
	this.setupListeners = function() {
		this.musicPlayer.audio().addEventListener('ended', this.trackEnded.bind(this), false);
		this.musicPlayer.audio().addEventListener('play', this.trackChange.bind(this), false);
		this.musicPlayer.audio().addEventListener('pause', this.trackPaused.bind(this), false);
	};
	this.removeListeners = function() {
		this.musicPlayer.audio().removeEventListener('ended', this.trackEnded.bind(this), false);
		this.musicPlayer.audio().removeEventListener('play', this.trackChange.bind(this), false);
		this.musicPlayer.audio().removeEventListener('pause', this.trackPaused.bind(this), false);
	};
};

DashboardAssistant.prototype = {
	setup: function() {
		this.controller.get('dashboard-player').addEventListener(Mojo.Event.tap, this.tapHandler.bindAsEventListener(this));
		if (typeof this.musicPlayer !== "undefined" && this.musicPlayer !== 0) {
			if (typeof this.musicPlayer.audio() !== "undefined") {
				this.setupListeners();
				this.updateSong();
			}
		}
	},

	handleLockEvent: function(event) {
		this.locked = !!event.locked;
	},
	cleanup: function() {
		this.removeListeners();
		//this.controller.get('dashboard-player').removeEventListener(Mojo.Event.tap, this.tapHandler.bindAsEventListener(this));
	//	Ares.cleanupSceneAssistant(this);
	},

	updateSong: function(arg) {
		if (typeof arg === "undefined") {
			Mojo.Log.info("Updating the dashboard");
			var song = this.musicPlayer.song();
			data = {
				title: song.name,
				artist: song.artist,
				pause: this.musicPlayer.isPlaying() ? "pause" : "",
				unlike: this.musicPlayer.liked() ? "unlike" : ""
			};
			renderedInfo = Mojo.View.render({
				object: data,
				template: 'dashboard/dashboard-player'
			});
			// Insert the HTML into the DOM, replacing the existing content.
			this.controller.get('dashboard-player').update(renderedInfo);
			myNewString = this.musicPlayer.photo().replace("original", "max200");
			strarray = myNewString.split(".");
			if (strarray[strarray.length - 1] === "jpeg" || strarray[strarray.length - 1] === "gif"){ 
					myNewString = Mojo.appPath + "/images/8tracksDash2.png";
				}
			// the template render doesn't do this properly, doing it manually
			this.controller.get('dashboard-player-art').style.background = "url(\"" + myNewString + "\") center center no-repeat";
		}else{
			Mojo.Log.info("Updating the dashboard");
			data = {
				title: arg,
				artist: "",
				pause: this.musicPlayer.isPlaying() ? "pause" : "",
				unlike: this.musicPlayer.liked() ? "unlike" : ""
			};
			renderedInfo = Mojo.View.render({
				object: data,
				template: 'dashboard/dashboard-player'
			});
			// Insert the HTML into the DOM, replacing the existing content.
			this.controller.get('dashboard-player').update(renderedInfo);
			myNewString = this.musicPlayer.photo().replace("original", "max200");
			strarray = myNewString.split(".");
			if (strarray[strarray.length - 1] === "jpeg" || strarray[strarray.length - 1] === "gif"){ 
				myNewString = Mojo.appPath + "/images/8tracksDash2.png";
			}
			// the template render doesn't do this properly, doing it manually
			//var thumbUrl = this.musicPlayer.photo();//Util.albumArtLargeUrlFormatter(song.thumbnails[0]);
			this.controller.get('dashboard-player-art').style.background = "url(\"" + myNewString + "\") center center no-repeat";
		}
	},
	trackEnded: function(event) {
		this.musicPlayer = DashPlayerInstance;
		this.updateSong();
	},
	trackChange: function(event) {
		this.musicPlayer = DashPlayerInstance;
		this.updateSong();
	},
	trackPaused: function(event) {
		if (!this.musicPlayer.isPlaying()) {
			this.controller.get('playpause').removeClassName("pause");
		} else {
			this.controller.get('playpause').addClassName("pause");
		}
	},
	togglePlay: function() {
		if (this.musicPlayer.isPlaying()) {
			this.controller.get('playpause').removeClassName("pause");
			this.musicPlayer.audio().pause();
		} else {
			this.controller.get('playpause').addClassName("pause");
			this.musicPlayer.audio().play();
		}
	},

	toggleLike: function() {
		if (this.musicPlayer.liked()) {
			this.controller.get('likeunlike').removeClassName("unlike");
			this.musicPlayer.toggleLike(false);
		} else {
			this.controller.get('likeunlike').addClassName("unlike");
			this.musicPlayer.toggleLike(true);
		}
	},

	updatePausePlayIcon: function() {
		if (this.musicPlayer.isPlaying()) {
			this.controller.get('playpause').addClassName("pause");
		} else {
			this.controller.get('playpause').removeClassName("pause");
		}
	},
	
	relaunch8tracks: function(){
		var parameters = {
			id:'com.mycompany.8tracks',
			params: {
				focus: true
			}
		};
		return new Mojo.Service.Request(
			'palm://com.palm.applicationManager',
				{
					method: 'open',
					parameters: parameters
				}
		);
	},
	tapHandler: function(event) {
		var id = event.target.id;
		if (id === 'playpause') {
			this.togglePlay();
		} else if (id === 'next') {
			this.musicPlayer.skipTrack();
			this.updateSong("Retrieving Next...");
		} else if (id === 'likeunlike') {
			if(this.musicPlayer.loggedIn()){
				this.toggleLike();
			}
		} else {
			if (!this.locked) {
				this.relaunch8tracks();
			}
		}
	}
};