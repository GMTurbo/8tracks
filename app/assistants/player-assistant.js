function PlayerAssistant(argFromPusher, token, response, mixphoto, setid, userid, username, password, liked) {
	this.mixID = argFromPusher;
	this.token = token;
	this.userid = -1;
	this.snapindex = 0;
	creds = checkForCredentials();
	this.loggedin = creds.loggedin;
	if (creds.userid !== -1) {
		this.liked = liked;
		this.userid = creds.userid;
		this.username = creds.username;
		this.password = creds.password;
		this.loggedin = true;
	}
	this.toggle = false;
	this.tracks = [];
	this.tracks.push(response.set.track);
	this.trackinfo = response;
	this.mphoto = mixphoto.toString() === "/images/mix_covers/max200.gif" ? Mojo.appPath + "/images/tracks_01.png" : mixphoto;
	this.lastsong = false;
	this.songProps = []; //skipped durations liked
	this.toReadableTime = function(duration) {
		var minutes = parseFloat(duration) / 60.0;
		var seconds = Math.round((minutes % 1) * 60);
		var s = (seconds / 100).toFixed(2);
		var s1 = seconds.toString().split(".");
		return s1[0].toString().length > 1 ? Math.floor(minutes) + ":" + s1[0] : Math.floor(minutes) + ":0" + s1[0];
	};
	this.listindex = 0;
	this.setid = setid;
	this.songstate = 1;
	this.headsetService = undefined;
	this.setupListeners = function() {
		this.audio1.addEventListener('ended', this.trackEnded.bind(this), false);
		this.audio1.addEventListener('play', this.trackPlay.bind(this), false);
		this.audio1.addEventListener('playing', this.trackPlaying.bind(this), false);
		this.audio1.addEventListener('pause', this.trackPaused.bind(this), false);
		this.audio1.addEventListener('timeupdate', this.updateScrubber.bind(this), false);
		this.audio1.addEventListener('stalled', this.trackStalled.bind(this), false);
		this.audio1.addEventListener('error', this.trackError.bind(this), false);
		this.audio1.addEventListener('canplay', this.trackReady.bind(this), false);
		this.audio1.addEventListener('ratechange', this.trackRateChange.bind(this), false);
		this.audio1.addEventListener('durationchange', this.trackDurationChanged.bind(this), false);
	};
	this.removeListeners = function() {
		this.audio1.removeEventListener('pause', this.trackPaused.bind(this), false);
		this.audio1.removeEventListener('play', this.trackPlay.bind(this), false);
		this.audio1.removeEventListener('playing', this.trackPlaying.bind(this), false);
		this.audio1.removeEventListener('Ended', this.trackEnded.bind(this), false);
		this.audio1.removeEventListener('timeupdate', this.updateScrubber.bind(this), false);
		this.audio1.removeEventListener('stalled', this.trackStalled.bind(this), false);
		this.audio1.removeEventListener('error', this.trackError.bind(this), false);
		this.audio1.removeEventListener('canplay', this.trackReady.bind(this), false);
		this.audio1.removeEventListener('ratechange', this.trackRateChange.bind(this), false);
		this.audio1.removeEventListener('durationchange', this.trackDurationChanged.bind(this), false);
	};
	this.writeDescription = function() {
		this.$.divider2.setLabel("Tracks (" + this.tracks.length + ")");
	};
	this.downloaded = false;
	if (typeof this.audio1 !== "object") {
		this.audio1 = new Audio();
	}
	this.sound = new Audio();
	this.sound.autoplay = true;
	this.downloadImage = function(url, onSuccess, onFailure) {
		if (!this.downloaded) {
			original = url.replace("max200", "original");
			split = url.split("/");
			name = split[split.length - 1];
			name = name.split(".")[0] + "." + name.split(".")[2];
			this.controller.serviceRequest('palm://com.palm.downloadmanager/', {
				method: 'download',
				parameters: {
					target: original,
					targetDir: "/media/internal/files/8tracks",
					targetFilename: name,
					keepFilenameOnRedirect: false,
					subscribe: false
				},
				onSuccess: onSuccess,
				onFailure: onFailure
			});
			this.downloaded = true;
		}
	};
	this.fillList = function(tracks) {
		this.list = new Array(tracks.length);
		for (var i = 0; i < tracks.length; i++) {
			if (i !== tracks.length - 1) {
				if (this.songProps[i].skipped) {
					this.list[i] = {
						title: tracks[i].name,
						currentartist: tracks[i].performer,
						skipped: tracks[i].name,
						likeImage: this.songProps[i].liked === true ? "images/likedstar.png" : "images/unlikedstarblack.png",
						duration: this.songProps[i].duration.toString() === "NaN:NaN" ? "?" : this.songProps[i].duration,
						liked: this.songProps[i].liked,
						buyImage: "images/buy.png"
					};
				} else {
					this.list[i] = {
						title: tracks[i].name,
						currentartist: tracks[i].performer,
						oldsong: tracks[i].name,
						likeImage: this.songProps[i].liked === true ? "images/likedstar.png" : "images/unlikedstarblack.png",
						duration: this.songProps[i].duration.toString() == "NaN:NaN" ? "?" : this.songProps[i].duration,
						liked: this.songProps[i].liked,
						buyImage: "images/buy.png"
					};
				}
			} else {
				if (this.songProps[i].set === false) {
					this.songProps[i].liked = tracks[i].faved_by_current_user;
					this.songProps[i].set = true;
				}
				this.list[i] = {
					title: tracks[i].name,
					currentartist: tracks[i].performer,
					currentsong: tracks[i].name,
					buyImage: "images/speaker.png",
					likeImage: this.songProps[i].liked === true ? "images/likedstar.png" : "images/unlikedstarblack.png",
					duration: "...",
					liked: this.songProps[i].liked
				};
			}
		}
		listModel = {
			items: this.list.reverse()
		};
		return {
			getList: function() {
				return listModel;
			}
		};
	};
	this.fillCommentList = function(comments, userid) {
		commentlist = new Array(comments.length);
		//new Date(tracks[i].first_published_at).toRelativeTime() === "NaN years ago" ? "by " + tracks[i].user.login : new Date(tracks[i].first_published_at).toRelativeTime()
		for (var i = 0; i < comments.length; i++) {
			commentlist[i] = {
				username: comments[i].user.login,
				userid: comments[i].user_id,
				timestamp: new Date(comments[i].created_at).toRelativeTime() === "NaN years ago" ? comments[i].created_at : new Date(comments[i].created_at).toRelativeTime(),
				body: comments[i].body,
				otheruserimage: comments[i].user.avatar_urls.sq56 === "/images/avatars/sq56.jpg" ? "images/unknownUser.jpg" : comments[i].user.avatar_urls.sq56,
				myuserimage: comments[i].user.avatar_urls.sq56 === "/images/avatars/sq56.jpg" ? "images/unknownUser.jpg" : comments[i].user.avatar_urls.sq56,
				hide: userid === comments[i].user_id ? "hide" : "",
				show: userid === comments[i].user_id ? "show" : "",
				right: userid === comments[i].user_id ? "right" : ""
			};
		}
		listModel = {
			items: commentlist.reverse()
		};
		return {
			getList: function() {
				return listModel;
			}
		};
	};
	this.populateList = function() {
		f = this.fillList(this.tracks);
		this.controller.setWidgetModel("list1", f.getList());
	};
	this.banner = function(message) {
		Mojo.Controller.getAppController().showBanner(message, {
			source: 'notification'
		});
	};
}

PlayerAssistant.prototype = {
	setup: function() {
		this.feedMenuModel = {
			visible: true,
			items: [
				{
				items: [{
					width: 0
				},
				{
					label: this.mixID.name,
					width: 320
				}]
			}]
		};
		this.controller.setupWidget(Mojo.Menu.viewMenu, {
			spacerHeight: 0,
			menuClass: 'no-fade'
		},
		this.feedMenuModel);
		this.cmdMenuModel = {
			visible: true,
			items: [
				{},
				{
				items: [{
					iconPath: 'images/pause1.png',
					label: $L('Pause'),
					command: '0'
				},{
					iconPath: 'images/forward.png',
					label: $L('Forward'),
					command: 'fwd'
				}]
			},{}]
		};

		this.controller.setupWidget(Mojo.Menu.commandMenu, {
			//spacerHeight: 0,
			menuClass: 'no-fade'
		},
		this.cmdMenuModel);

		var atts = {
			textFieldName: 'comment',
			hintText: 'Enter comment',
			modelProperty: 'value',
			multiline: true,
			limitResize: false
		};
		this.controller.setupWidget('multilineTextField', atts, {});
		Mojo.Event.listen(this.controller.get("addcomment"), Mojo.Event.tap, this.addComment.bind(this));
		Mojo.Event.listen(this.controller.get("sendbuttonid"), Mojo.Event.tap, this.postComment.bind(this));
		this.cookie3 = new Mojo.Model.Cookie("nmp");
		if (!this.cookie3.get()) {
			nmpState = 'autoplay';
		} else {
			nmpState = this.cookie3.get().answer;
		}

		this.appMenuModel = {
			items: [
				{
				label: "Share Mix...",
				command: 'share'
			},
				{
				label: this.liked ? "Unlike Mix" : "Like Mix",
				command: this.liked ? 'unlike' : 'like',
				disabled: !this.loggedin
			},
				{
				label: "Auto-play Next Mix",
				command: nmpState == 'autoplay' ? "return" : "autoplay",
				iconPath: nmpState == 'autoplay' ? Mojo.appPath + "/images/check_mark.png" : "none"
			}
				]
		};

		if (!this.loggedin) {
			this.appMenuModel.items[1].label = "Like Mix (Login Required)";
		}
		this.controller.setupWidget(Mojo.Menu.appMenu, {},
		this.appMenuModel);

		this.controller.setupWidget("progressbarId", this.attributes = {
			title: "Progress Bar",
			image: "images/header-icon.png",
			modelProperty: "progress"
		},
		this.model = {
			iconPath: "../images/progress-bar-background.png",
			progress: 0
		});

		this.headsetService = new Mojo.Service.Request('palm://com.palm.keys/headset', {
			method: 'status',
			parameters: {
				'subscribe': true
			},
			onFailure: function() {
				Mojo.Log.error("Could not subscribe to headset events");
			},
			onSuccess: this.handleheadset.bind(this)
		});

		this.bluetoothService = new Mojo.Service.Request('palm://com.palm.keys/media', {
			method: 'status',
			parameters: {
				'subscribe': true
			},
			onFailure: function() {
				Mojo.Log.error("Could not subscribe to headset events");
			},
			onSuccess: this.handleBluetooth.bind(this)
		});
		if (this.audio1.currentSrc.length > 0) {
			this.removeListeners();
			this.audio1.pause();
			this.audio1 = 0;
			this.audio1 = new Audio();
		}
		this.setupListeners();
		this.libs = MojoLoader.require({
			name: "mediaextension",
			version: "1.0"
		});
		try {
			this.extObj = this.libs.mediaextension.MediaExtension.getInstance(this.audio1);
			this.extObj.audioClass = "media";
		}
		catch(err) {
			//this.banner(err);
		}

		Mojo.Event.listen(this.controller.document, Mojo.Event.stageDeactivate, this.onDeactivateHandler.bind(this));
		Mojo.Event.listen(this.controller.document, Mojo.Event.stageActivate, this.onActivateHandler.bind(this));
		Ares.setupSceneAssistant(this);
		Mojo.Event.listen(this.controller.get("scroller1"), Mojo.Event.propertyChange, this.handleUpdate.bind(this));
	},
	cleanup: function() {
		DashPlayerInstance.cleanup();
		DashPlayerInstance = 0;
		this.audio1.pause();
		this.removeListeners();

		this.audio1 = 0;
		if (this.headsetService) {
			this.headsetService.cancel();
		}
		if (this.bluetoothService) {
			this.bluetoothService.cancel();
		}
		Mojo.Event.stopListening(this.controller.document, Mojo.Event.stageDeactivate, this.onDeactivateHandler.bind(this));
		Mojo.Event.stopListening(this.controller.document, Mojo.Event.stageActivate, this.onActivateHandler.bind(this));
		Mojo.Event.stopListening(this.controller.get("scroller1"), Mojo.Event.propertyChange, this.handleUpdate.bind(this));
		Mojo.Event.stopListening(this.controller.get("addcomment"), Mojo.Event.tap, this.addComment.bind(this));
		Mojo.Event.stopListening(this.controller.get("sendbuttonid"), Mojo.Event.tap, this.postComment.bind(this));
		this.onActivateHandler();
		Ares.cleanupSceneAssistant(this);
	},
	activate: function() {
		this.showSpinner(true);
		this.cookie2 = new Mojo.Model.Cookie("prefs");
		if (this.cookie2.get()) {
			props = themeLookup(this.cookie2.get().theme);
			this.controller.get('player').style.backgroundImage = props.URL;
			this.$.list1.style.addStyles({
				textColor: props.textColor
			});
		}
		this.controller.setWidgetModel("html2", {
			pic2: this.mphoto
		});
		songprop = {
			skipped: false,
			duration: 0,
			liked: false,
			set: false
		};
		this.songProps.push(songprop);
		this.writeDescription();
		this.populateList();
		if (!this.audio1.paused) {
			this.audio1.pause();
		}
		this.audio1.src = this.trackinfo.set.track.url;
		this.audio1.load();

		DashPlayerInstance = new DashboardPlayer();
		DashPlayerInstance.setSkipEvent(this.skipTrack.bind(this));
		DashPlayerInstance.setLikeToggleEvent(this.setLikeStateCurrent.bind(this));
		DashPlayerInstance.setLogin(this.loggedin);
		DashPlayerInstance.update(this.audio1, this.mphoto, this.trackinfo);
		this.loadComments();
		//this.finishEvent("test",true);
	},
	finishEvent: function(message, state) {
		var dashboardStage = this.controller.stageController.getAppController().getStageProxy("mixDetailsScene");
		if (dashboardStage) {
			data = {
				state: state,
				message: message
			};
			dashboardStage.delegateToSceneAssistant("finishedDad", data);
		}
	},
	handleUpdate: function(event) {
		switch (event.value) {
		case 0:
			//this.controller.get("overlayHeart").removeClassName("move");
			//this.controller.get("overlayNewMix").removeClassName("move");
			//	$('overlayMix').style.top = "55px";
			$('addcomment').style.right = "-55px";
			//$('overlayImage').removeClassName("fade");
			$('inputcomment').style.bottom = "-600px";
			$('inputcomment').style.left = "-320px";
			$('inputcomment').style.height = "0px";
			$('inputcomment').removeClassName("show");
			$('sendbuttonid').removeClassName("show");
			this.controller.get("multilineTextField").mojo.setValue("");
			this.controller.get("multilineTextField").blur();
			this.snapindex = 0;
			break;
		case 1:
			//this.controller.get("overlayHeart").addClassName("move");
			//this.controller.get("overlayNewMix").addClassName("move");
			//$('overlayMix').style.top = "-72px";
			$('addcomment').style.right = "0px";
			//$('overlayImage').addClassName("fade");
			//$('inputcomment').addClassName("show");
			//$('sendbuttonid').addClassName("show");
			/*$('inputcomment').style.bottom = "100px";
			$('inputcomment').style.left = "25px";
			$('inputcomment').style.height = "120px";
			*/
			this.snapindex = 1;
			break;
		}
	},
	addComment: function(event) {
		$('inputcomment').addClassName("show");
		$('inputcomment').style.bottom = "100px";
		$('inputcomment').style.left = "25px";
		$('inputcomment').style.height = "120px";
		$('sendbuttonid').addClassName("show");
		
		//$('inputcomment').removeClassName("shrink");

		this.controller.get("multilineTextField").focus();
		//this.controller.get("multilineTextField").mojo.setValue("");
	},
	postComment: function() {
		if (this.loggedin) {
			this.showSpinner(true);
			//"review[mix_id]=14&review[body]=body" http://8tracks.com/reviews.xml
			$('inputcomment').style.bottom = "-600px";
			$('inputcomment').style.left = "-320px";
			$('inputcomment').style.height = "0px";
			$('inputcomment').addClassName("shrink");
			//$('sendbuttonid').removeClassName("show");
			this.controller.get("multilineTextField").blur();
			var message = this.controller.get("multilineTextField").mojo.getValue();
			var onFailure = function(transport) {
				this.showSpinner(false);
				this.popUp("Error", "Could not post comment\n" + transport.responseText, this.controller);
			};
			var onComplete = function(transport) {
				this.loadComments();
				this.showSpinner(false);
				/*$('inputcomment').style.bottom = "-600px";
			$('inputcomment').style.left = "-320px";
			$('inputcomment').style.height = "0px";
			$('sendbuttonid').removeClassName("show");
			this.controller.get("multilineTextField").blur();
			this.controller.get("multilineTextField").mojo.setValue("");*/
			};
			var postdata = "login=" + this.username + "&password=" + this.password;
			var url = "http://8tracks.com/reviews.xml&"+API_KEY;
			var postbody = "review[mix_id]=" + this.mixID.id + "&review[body]=" + message.replace(/ /g, "%20");
			post(url, postdata, onComplete.bind(this), onFailure.bind(this), postbody);
		} else {
			this.banner("login required to comment");
		}
	},
	updateDash: function(audioObj, pic, trackinfo) {
		var dashboardStage = this.controller.stageController.getAppController().getStageProxy("dashboard");
		if (dashboardStage) {
			data = {
				type: 'audio',
				audio: audioObj,
				photo: pic,
				trackinfo: trackinfo
			};
			dashboardStage.delegateToSceneAssistant("updateDashboard", data);
		}
	},
	sendMessageToDash: function(message) {
		var dashboardStage = this.controller.stageController.getAppController().getStageProxy("dashboard");
		if (dashboardStage) {
			data = {
				type: 'error',
				text: message
			};
			dashboardStage.delegateToSceneAssistant("updateDashboard", data);
		}
	},
	setDashLikeState: function(state) {
		var dashboardStage = this.controller.stageController.getAppController().getStageProxy("dashboard");
		if (dashboardStage) {
			data = {
				type: 'likeState',
				state: state
			};
			dashboardStage.delegateToSceneAssistant("updateDashboard", data);
		}
	},

	onDeactivateHandler: function(event) {
		if (DashPlayerInstance !== 0) {
			if (DashPlayerInstance.audio() !== 0) {
				var dashboardController = this.controller.stageController.getAppController().getStageController("dashboard");
				if (!dashboardController) {
					this.controller.stageController.getAppController().createStageWithCallback({
						name: "dashboard",
						lightweight: true,
						clickableWhenLocked: true
					},
					this.loadDashboard, 'dashboard');
				}
			}
		}
	},
	loadDashboard: function(stageController) {
		stageController.pushScene("dashboard", DashPlayerInstance);
	},
	onActivateHandler: function(event) {
		var dashboardController = Mojo.Controller.getAppController().getStageController("dashboard");
		if (dashboardController) {
			this.appController = Mojo.Controller.getAppController();
			this.appController.closeStage("dashboard");
		}
	},
	showSpinner: function(show) {
		if (!show) {
			this.feedMenuModel.items[0].items[1].width = 320;
			this.feedMenuModel.items[0].items[0].width = 0;
			this.controller.modelChanged(this.feedMenuModel, this);
			this.controller.get('spinner1').mojo.stop();
		} else {
			this.feedMenuModel.items[0].items[1].width = 275;
			this.feedMenuModel.items[0].items[0].width = 45;
			this.controller.modelChanged(this.feedMenuModel, this);
			this.controller.get('spinner1').mojo.start();
		}
	},
	showBanner: function(message) {
		Mojo.Controller.getAppController().showBanner(message, {
			source: 'notification'
		});
	},
	showErrorBanner: function(msg) {
		Mojo.Controller.getAppController().showBanner({
			icon: "alert.png",
			messageText: msg
		},
		msg);
	},
	handleheadset: function(payload) {
		switch (payload.state) {
		case "double_click":
			this.skipTrack();
			break;
		case "single_click":
			this.toggleSongState();
			break;
		}
	},

	handleBluetooth: function(event) {
		var state = event.state;

		if (state) {
			if (state === "down") {
				var key = event.key;
				switch (key) {
					// this looks strange, but there may be events we need to translate
				case "next":
					this.skipTrack();
					break;
				case "pause":
					this.songState(false);
					break;
				case "play":
					this.songState(true);
					break;
				}
			}
		}
	},
	modifyListElementDuration: function() {
		if (this.audio1.duration.toString() !== "Infinity" || this.audio1.duration.toString() !== "undefined") {
			if (this.list[0].duration === "...") {
				this.list[0].duration = this.toReadableTime(this.audio1.duration);
				listModel = {
					items: this.list.reverse()
				};
				this.controller.modelChanged("list1", listModel);
			}
		}
	},
	updateScrubber: function(event) {
		if (this.audio1.duration.toString() !== "NaN") {
			var time = (parseFloat(this.audio1.currentTime) / parseFloat(this.audio1.duration));
			this.model.progress = time;
			this.controller.modelChanged(this.model, this);
			if (this.audio1.currentTime + 2 > this.audio1.buffered.end()) {
				if (Math.ceil(this.audio1.buffered.end()) != Math.ceil(this.audio1.duration)) {
					this.songState(0);
					//this.load();
				}
			}
		}
	},
	loadComments: function() {
		this.showSpinner(true);
		var onComplete = function(response) {
			f = this.fillCommentList(response.responseJSON.reviews, this.userid);
			this.controller.setWidgetModel("list2", f.getList());
			//this.ready = true;
			//this.$.list1.items = this.commentlist;
			//	this.controller.get("list1").mojo.noticeUpdatedItems(0, this.commentlist); //noticeAddedItems
			//	this.controller.get("list1").mojo.setLength(this.commentlist.length);
			//this.controller.setWidgetModel("html2", {
			//	commentcount: f.getList().items.length === 50 ? f.getList().items.length + "+" : f.getList().items.length
			//});
			var self = this;
			this.controller.window.setTimeout(function() {
				self.controller.get("scroller5").mojo.revealBottom();
			},
			300);
			spinner(false);
		};

		var onFailure = function(response) {
			this.showBanner("error getting mix comments");
			this.showSpinner(false);
		};

		var url = "http://8tracks.com/mixes/" + this.mixID.id + "/reviews.json?per_page=20&" + API_KEY;
		request(url, onComplete.bind(this), onFailure.bind(this));
	},
	requestNext: function(url, onComplete, onFailure) {
		this.showSpinner(true);
		this.model.progress = 0;
		this.controller.modelChanged(this.model, this);
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
	loadNextMix2: function() {
		this.cookie3 = new Mojo.Model.Cookie("nmp");
		if (this.cookie3.get()) {
			if (this.cookie3.get().answer === 'autoplay') {
				this.loadNextMix();
			} else {
				this.controller.stageController.popScene("finished");
			}
		} else {
			this.askForNMPref();
		}
	},
	loadNextMix: function() {
		var onComplete = function(transport) {
			if (transport.status == 200) {
				this.showBanner("New Mix: " + transport.responseJSON.next_mix.name);
				this.mphoto = transport.responseJSON.next_mix.cover_urls.max200;
				this.controller.setWidgetModel("html2", {
					pic2: this.mphoto
				});
				this.model.progress = 0;
				this.controller.modelChanged(this.model, this);
				this.mixID = transport.responseJSON.next_mix;
				this.liked = this.mixID.liked_by_current_user;
				this.feedMenuModel.items[0].items[1].label = this.mixID.name;
				this.appMenuModel.items[1].label = this.mixID.liked_by_current_user ? "Unlike Mix" : "Like Mix";
				this.appMenuModel.items[1].command = this.mixID.liked_by_current_user ? "unlike" : "like";
				this.controller.modelChanged(this.feedMenuModel, this);
				this.controller.modelChanged(this.appMenuModel, this);
				this.setid = this.mixID.id;
				var onComplete = function(transport) {
					if (transport.status == 200) {
						this.audio1.pause();
						this.audio1.src = transport.responseJSON.set.track.url;
						this.audio1.load();
						response = transport.responseJSON;
						this.tracks = 0;
						this.tracks = [];
						this.tracks.push(response.set.track);
						this.trackinfo = response;
						this.lastsong = false;
						this.songProps = [];
						songprop = {
							skipped: false,
							duration: 0,
							liked: false,
							set: false
						};
						this.songProps.push(songprop);
						this.listindex = 0;
						this.songstate = 1;
						DashPlayerInstance.update(this.audio1, this.mphoto, this.trackinfo);
						this.updateDash(this.audio1, this.mphoto, this.trackinfo);
						this.showBanner("Now Playing: " + transport.responseJSON.set.track.performer + " - " + transport.responseJSON.set.track.name);
						this.populateList();
						this.writeDescription();
					}
				};
				var onFailure = function(transport) {
					this.showSpinner(false);
					this.popUp("", "");
				};
				var url = "http://8tracks.com/sets/" + this.token + "/play.json?mix_id=" + this.mixID.id + "&" + API_KEY;
				this.requestNext(url, onComplete.bind(this), onFailure.bind(this));
			}
		};
		var onFailure = function(transport) {
			this.controller.stageController.popScene(true);
		};
		url = "http://8tracks.com/sets/" + this.token + "/play_next_mix.json?mix_id=" + this.mixID.id+ "&" + API_KEY;
		this.requestNext(url, onComplete.bind(this), onFailure.bind(this));
	},
	skipTrack: function() {
		var onComplete = function(transport) {
			if (transport.status == 200) {
				this.lastsong = transport.responseJSON.set.at_end;
				if (!this.lastsong) {
					this.model.progress = 0;
					this.controller.modelChanged(this.model, this);
					if (typeof this.audio1 !== "undefined") {
						dur = this.toReadableTime(this.audio1.duration);
					} else {
						dur = 0;
					}
					this.songProps[this.songProps.length - 1].skipped = true;
					this.songProps[this.songProps.length - 1].duration = dur;
					props = {
						skipped: false,
						duration: 0,
						liked: false,
						set: false
					};
					this.songProps.push(props);
					this.audio1.pause();
					this.lastsong = transport.responseJSON.set.at_end;
					this.track = transport.response;
					this.audio1.src = transport.responseJSON.set.track.url;
					this.showBanner("Now Playing: " + transport.responseJSON.set.track.performer + " - " + transport.responseJSON.set.track.name);
					this.audio1.load();
					this.tracks.push(transport.responseJSON.set.track);
					this.trackinfo = transport.responseJSON;
					DashPlayerInstance.update(this.audio1, this.mphoto, this.trackinfo);
					this.updateDash(this.audio1, this.mphoto, this.trackinfo);
					this.populateList();
					this.writeDescription();
				} else {
					this.loadNextMix2();
				}
			} else if (transport.status === "403 Forbidden") {
				Mojo.Controller.getAppController().playSoundNotification("defaultapp", "sounds/error.mp3");
				this.Popup("Oops!", "Can't skip anymore");
				this.sendMessageToDash("No more skips allowed");
			}
		};
		var onFailure = function(transport) {
			this.showSpinner(false);
			this.Popup("Oops", "No more skips allowed...");
			this.sendMessageToDash("No more skips allowed");
		};
		var url = "http://8tracks.com/sets/" + this.token + "/skip.json?mix_id=" + this.mixID.id+ "&" + API_KEY;
		this.requestNext(url, onComplete.bind(this), onFailure.bind(this));
	},
	askForNMPref: function() {
		this.sound.src = Mojo.appPath + "/sounds/error.mp3";
		this.sound.load();
		//this.sound.play();
		Mojo.Controller.getAppController().playSoundNotification("defaultapp", "sounds/error.mp3");
		this.sendMessageToDash("Input Required!");
		this.controller.showAlertDialog({
			onChoose: this.setMixPref.bind(this),
			title: "Nex Mix Preference",
			message: "What do you want to do now?",
			choices: [
				{
				label: "Auto Play",
				value: "autoplay",
				type: 'affirmative'
			},{
				label: "Back to Mix Details",
				value: "return",
				type: 'negative'
			}
				]
		});
	},
	setMixPref: function(response, noskip) {
		switch (response) {
		case 'autoplay':
			this.cookie3 = new Mojo.Model.Cookie("nmp");
			this.cookie3.put({
				answer: 'autoplay'
			});
			this.appMenuModel.items[2].command = 'return';
			this.appMenuModel.items[2].iconPath = Mojo.appPath + "/images/check_mark.png"; //false;
			this.controller.modelChanged(this.appMenuModel, this);
			if (typeof noskip === "undefined") {
				this.showBanner("Selection Saved");
				this.loadNextMix();
			}
			break;
		case 'return':
			this.cookie3 = new Mojo.Model.Cookie("nmp");
			this.cookie3.put({
				answer: 'return'
			});
			this.appMenuModel.items[2].command = 'autoplay';
			this.appMenuModel.items[2].iconPath = "";
			this.controller.modelChanged(this.appMenuModel, this);
			if (typeof noskip === "undefined") {
				this.showBanner("Selection Saved");
				this.controller.stageController.popScene("finished");
			}
			break;
		}
	},
	nextTrack: function() {
		var onComplete = function(transport) {
			if (transport.status == 200) {
				this.lastsong = transport.responseJSON.set.at_end;
				if (!this.lastsong) {
					this.model.progress = 0;
					this.controller.modelChanged(this.model, this);
					if (typeof this.audio1 !== "undefined") {
						dur = this.toReadableTime(this.audio1.duration);
					} else {
						dur = 0;
					}
					this.songProps[this.songProps.length - 1].duration = dur;
					props = {
						skipped: false,
						duration: 0,
						liked: false,
						set: false
					};
					this.songProps.push(props);
					this.audio1.pause();
					this.track = transport.response;
					this.audio1.src = transport.responseJSON.set.track.url;
					this.showBanner("Now Playing: " + transport.responseJSON.set.track.performer + " - " + transport.responseJSON.set.track.name);
					this.audio1.load();
					this.tracks.push(transport.responseJSON.set.track);
					this.trackinfo = transport.responseJSON;
					DashPlayerInstance.update(this.audio1, this.mphoto, this.trackinfo);
					this.updateDash(this.audio1, this.mphoto, this.trackinfo);
					this.populateList();
					this.writeDescription();
				} else {
					this.loadNextMix2();
				}
			} else if (transport.status === "403 Forbidden") {
				this.showSpinner(false);
				this.banner("Can't skip anymore");
				this.sendMessageToDash("No more skips allowed");
			}
		};
		var onFailure = function(transport) {
			this.Popup("Oops", "Error getting next track...");
		};
		var url = "http://8tracks.com/sets/" + this.token + "/next.json?mix_id=" + this.mixID.id+ "&" + API_KEY;
		this.requestNext(url, onComplete.bind(this), onFailure.bind(this));
	},

	Popup: function(title, message) {
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
	},
	picture1Hold: function(inSender, event) {
		var onSuccess = function() {
			this.showBanner("Image Saved to Device");
		};
		var onFailure = function() {
			this.showBanner("Download Failed");
		};
		this.downloadImage(this.mphoto, onSuccess.bind(this), onFailure.bind(this));
		event.stop();
	},

	trackEnded: function(event) {
		this.nextTrack();
	},
	trackPaused: function(event) {
		this.songState(0);
	},
	trackStalled: function(event) {
		//this.showSpinner(true);
	},
	trackError: function(event) {
		this.showSpinner(false);
		var title = "";
		var message = "";
		this.sound.pause();
		this.sound.src = Mojo.appPath + "/sounds/error.mp3";
		this.sound.load();
		//this.sound.play();
		Mojo.Controller.getAppController().playSoundNotification("defaultapp", "sounds/error.mp3");
		switch (this.audio1.error.code) {
		case 1:
			title = "Denied";
			message = "8tracks denied this song for you to stream!";
			this.sendMessageToDash("denied stream from server");
			this.Popup(title, message);
			break;
		case 2:
			title = "Network Error";
			message = "There is a problem fetching this song from the 8tracks servers.. Let's try the next one!";
			this.sendMessageToDash(title);
			this.Popup(title, message);
			break;
		case 3:
			title = "Decode Error";
			message = "Error decoding the song!";
			this.sendMessageToDash("error decoding song");
			this.Popup(title, message);
			break;
		case 4:
			title = "Not Supported type!";
			message = "How did this happen?!";
			this.sendMessageToDash(title);
			this.Popup(title, message);
			break;
		}
		this.Popup(title, message);
		if (!this.lastsong) {
			this.nextTrack();
		} else {
			this.controller.stageController.popScene({
				error: 1
			});
		}
	},
	trackPlay: function(event) {
		this.songState(1);
	},

	trackPlaying: function(event) {
		this.showSpinner(false);
	},
	trackReady: function(event) {
		this.audio1.play();
	},
	trackRateChange: function(event) {
		//var buffer = this.audio1.buffered;
	},
	trackDurationChanged: function(event) {
		this.modifyListElementDuration();
	},
	picture1Tap: function(inSender, event) {
		this.toggleSongState();
	},
	toggleSongState: function() {
		if (!this.songstate) {
			this.songstate = 1;
		} else {
			this.songstate = 0;
		}
		this.controller.modelChanged(this.cmdMenuModel, this);
		this.songState(this.songstate);
	},
	songState: function(state) {
		if (state) {
			this.songstate = state;
			this.audio1.play();
			this.cmdMenuModel.items[1].items[0].iconPath = 'images/pause1.png';
			this.cmdMenuModel.items[1].items[0].label = "Pause";
			this.cmdMenuModel.items[1].items[0].command = "0";
		} else {
			this.songstate = state;
			this.audio1.pause();
			this.cmdMenuModel.items[1].items[0].iconPath = 'images/playselected.png';
			this.cmdMenuModel.items[1].items[0].label = "Play";
			this.cmdMenuModel.items[1].items[0].command = "1";
		}
		this.controller.modelChanged(this.cmdMenuModel, this);
	},
	list1Listtap: function(inSender, event) {
		var selected = this.tracks[this.tracks.length - event.index - 1];
		classname = event.originalEvent.target.className;
		if (classname === "likeimg") {
			if (this.loggedin) {
				event.item.liked = !event.item.liked;
				this.songProps[this.tracks.length - event.index - 1].liked = event.item.liked;
				this.setLikeState(selected, !event.item.liked);
			} else {
				this.showErrorBanner("login required to like songs");
			}
		} else if (classname === "buyimg") {
			this.Buy(selected.buy_link, selected.performer, selected.name);
		} else {
			this.controller.popupSubmenu({
				onChoose: this.popupHandler,
				placeNear: event.originalEvent.target,
				items: [{
					label: 'Write it down',
					command: 'save'
				}]
			});
		}
	},
	Buy: function(link, artist, song) {
		var onFailure = function(transport) {
			this.Popup("Oops", "Where is your Amazon Store App?!");
		};
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
			method: 'launch',
			parameters: {
				id: 'com.palm.app.amazonstore',
				params: {
					artist: artist,
					song: song
				}
			},
			onFailure: onFailure.bind(this)
		});
	},
	writeDown: function(artist, track) {
		var onSuccess = function(transport) {

		};
		var onFailure = function(transport) {
			this.popUp("crap", "");
		};
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
			method: 'launch',
			parameters: {
				id: 'com.palm.app.notes',
				params: {
					text: artist + ": " + track
				}
			},
			onFailure: onFailure.bind(this),
			onSuccess: onSuccess.bind(this)
		});
	},
	setLikeStateCurrent: function(state) {
		song = this.tracks[this.tracks.length - 1];
		this.songProps[this.songProps.length - 1].liked = state;
		this.setLikeState(song, !state);
	},
	setLikeState: function(song, state) {
		this.song = song;
		var onFailure = function(transport) {
			this.Popup("Error", "Could not Like this song! Try to login again...");
		};
		var postdata = "login=" + this.username + "&password=" + this.password;
		if (!state) {
			url = "http://8tracks.com/tracks/" + song.id + "/fav.json";
			url = sendURL(url,true);
			myAjax = new Ajax.Request(url, {
				method: "post",
				requestHeader: postdata,
				onComplete: this.songLiked.bind(this),
				onFailure: onFailure.bind(this)
			});
		} else {
			url = "http://8tracks.com/tracks/" + song.id + "/unfav.json";
			url = sendURL(url,true);
			myAjax = new Ajax.Request(url, {
				method: "post",
				requestHeader: postdata,
				onSuccess: this.songUnliked.bind(this),
				onFailure: onFailure.bind(this)
			});
		}
	},
	songLiked: function(transport) {
		DashPlayerInstance.updateLike(true);
		this.setDashLikeState(true);
		this.banner("You like " + this.song.name);
		this.populateList();
	},
	songUnliked: function(transport) {
		DashPlayerInstance.updateLike(false);
		this.setDashLikeState(false);
		this.banner("You don't like " + this.song.name + " anymore");
		this.populateList();
	},
	Like: function() {
		var onFailure = function(transport) {
			this.showBanner("Could not add mix to your liked mix. Try to login again");
		};
		var postdata = "login=" + this.username + "&password=" + this.password;
		var url = "http://8tracks.com/mixes/" + this.mixID.id + "/like.json";
		url = sendURL(url,true);
		var myAjax = new Ajax.Request(url, {
			method: "post",
			requestHeader: postdata,
			onComplete: this.LikedComplete.bind(this),
			onFailure: onFailure.bind(this)
		});
	},
	LikedComplete: function(response) {
		if (response.responseJSON.status === "200 OK") {
			this.showBanner("Mixed added to your Liked list");
			this.liked = true;
			this.appMenuModel.items[1].command = "unlike";
			this.appMenuModel.items[1].label = "Unlike Mix";
			this.controller.modelChanged(this.appMenuModel, this);
		} else {
			this.popUp(response.responseJSON.status, response.responseJSON.notices);
		}
	},
	UnLike: function() {
		var onFailure = function(transport) {
			this.showBanner("Could not remove mix to your liked mix. Try to login again");
		};
		var postdata = "login=" + this.username + "&password=" + this.password;
		url = "http://8tracks.com/mixes/" + this.mixID.id + "/unlike.json";
		url = sendURL(url,true);
		var myAjax = new Ajax.Request(url, {
			method: "post",
			requestHeader: postdata,
			onComplete: this.UnLikedComplete.bind(this),
			onFailure: onFailure.bind(this)
		});
	},
	UnLikedComplete: function(response) {
		this.showBanner("Mixed removed from your Liked list");
		this.liked = false;
		this.appMenuModel.items[1].command = "like";
		this.appMenuModel.items[1].label = "Like Mix";
		this.controller.modelChanged(this.appMenuModel, this);
	}
};

PlayerAssistant.prototype.handleCommand = function(event) {
	this.controller = Mojo.Controller.stageController.activeScene();
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
		case 'fwd':
			//this.loadNextMix2();
			//this.loadNextMix();
			this.sound.pause();
			this.sound.src = Mojo.appPath + "/sounds/nextmix.mp3";
			this.sound.load();
			//this.sound.play();
			//Mojo.Controller.getAppController().playSoundNotification("defaultapp", "sounds/nextmix.mp3");
			this.skipTrack();
			break;
		case 'back':
			this.getPreviousPage();
			break;
		case '1':
			this.songState(1);
			break;
		case '0':
			this.songState(0);
			break;
		case 'share':
			/*this.controller.serviceRequest("palm://com.palm.applicationManager", {
				method: 'open',
				parameters: {
					id: "com.palm.app.email",
					params: {
						summary: "Checkout this 8tracks mix!",
						text: "Checkout this Mix: \n" + this.mixID.name + "\nwww.8tracks.com" + this.mixID.path
					}
				}
			});*/
			this.controller.serviceRequest("palm://com.palm.applicationManager", {
				method: 'open',
				parameters: {
					id: "com.palm.app.email",
					params: {
						summary: "Checkout this 8tracks mix",
						//text: "<b><br><a href=\"www.8tracks.com"+this.mixInfo.path+"\">"+this.mixInfo.name+"</a>" + "</b><br><br><i>" + this.mixInfo.description +"</i>"
						text: "<b>" + this.mixID.name + "</b><br><br><i>" + this.mixID.description + "</i><br><br><a href=\"www.8tracks.com" + this.mixID.path + "\">" + "Listen to this!" + "</a>"
					}
				}
			});
			break;
		case 'like':
			this.Like();
			break;
		case 'unlike':
			this.UnLike();
			break;
		case 'return':
			this.setMixPref('return', true);
			break;
		case 'autoplay':
			this.setMixPref('autoplay', true);
			break;
		}
	} else if (event.type === Mojo.Event.back) {
		if ($('inputcomment').style.bottom !== "-600px") {
			$('inputcomment').style.bottom = "-600px";
			$('inputcomment').style.left = "-320px";
			$('inputcomment').style.height = "0px";
			$('sendbuttonid').removeClassName("show");
			//$('inputcomment').addClassName("shrink");
			this.controller.get("multilineTextField").mojo.setValue("");
			this.controller.get("multilineTextField").blur();
			event.stop();
		} else if (this.snapindex === 1) {
			this.controller.get("bodyScroller").mojo.setSnapIndex(0, true);
			event.stop();
		}
	}
};

PlayerAssistant.prototype.popupHandler = function(command) {
	this.controller = Mojo.Controller.stageController.activeScene();
	var selected = this.tracks[this.tracks.length - this.listindex - 1];
	switch (command) {
	case "buy":
		this.Buy(selected.buy_link, selected.performer, selected.name);
		break;
	case "save":
		this.writeDown(selected.performer, selected.name);
		break;
	case "lksong":
		this.songProps[this.tracks.length - this.listindex - 1].liked = true;
		this.setLikeState(selected, false);
		break;
	case "unlksong":
		this.songProps[this.tracks.length - this.listindex - 1].liked = false;
		this.setLikeState(selected, true);
		break;
	}
};