function UserInfoAssistant(argFromPusher) {
	this.userInfo = argFromPusher;
	this.token = 0;
	this.mixInfo = 0;
	this.loggedin = false;
	this.cookie = new Mojo.Model.Cookie("credentials");
	if (this.cookie.get()) {
		this.username = this.cookie.get().username;
		this.password = this.cookie.get().password;
		if (this.cookie.get().username !== "") {
			this.loggedin = true;
		}
	}else{
		this.setid = -1;
		this.username = "";
		this.password= "";
	}
	this.fillList = function(tracks) {
		var list = new Array(tracks.length);
		for (var i = 0; i < tracks.length; i++) {
					var name = tracks[i].name;
			var tag = tracks[i].tag_list_cache;
			if (name !== null) {
				if (name.length > 30) {
					name = name.substring(0, 30) + "...";
				}
			}
			if (tag !== null) {
				if (tag.length > 30) {
					tag = tag.substring(0, 30) + "...";
				}
			}
			list[i] = {
				title: name,
				leftImage: tracks[i].cover_urls.sq56.toString() === "/images/mix_covers/sq56.gif" ? Mojo.appPath + "/images/no_image.png" : tracks[i].cover_urls.sq56,
				tag: tag,
				mixInfo: tracks[i]
			};
		}
		listModel = {
			items: list
		};
		return {
			getList: function() {
				return listModel;
			}
		};
	};
	this.writeUserDetails = function(info1, info2) {
		if (info1 === null) {
			this.$.label3.setLabel("No bio available");
		} else if (info1.indexOf("<p>") >= 0) {
			info1 = info1.split("<p>")[1];
			info1 = info1.split("</p>")[0];
			this.$.label3.setLabel(info1);
		} else {
			this.$.label3.setLabel(info1);
		}
	};
	this.popUp = function(title, message) {
		Mojo.Controller.getAppController().showBanner(message, {
			source: 'notification'
		});
	};
}

UserInfoAssistant.prototype = {
	setup: function() {
		this.cmdMenuModel = {
			visible: true,
			items: [
				{
				items: [{},{},{
					label: $L('Follow'),
					command: 'flw'
				}]
			}]
		};

		this.controller.setupWidget(Mojo.Menu.commandMenu, {
			//spacerHeight: 0,
			menuClass: 'no-fade'
		},
		this.cmdMenuModel);
		this.feedMenuModel = {
			visible: true,
			items: [
				{
				items: [{
					width: 0
				},
					                {
					label: this.userInfo.login,
					width: 320
				}]
			}
				]
		};
		this.controller.setupWidget(Mojo.Menu.viewMenu, {
			spacerHeight: 0,
			menuClass: 'no-fade'
		},
		this.feedMenuModel);

		Ares.setupSceneAssistant(this);
	},
	cleanup: function() {
		Ares.cleanupSceneAssistant(this);
	},
	activate: function() {
		this.cookie2 = new Mojo.Model.Cookie("prefs");
		if (this.cookie2.get()) {
			props = themeLookup(this.cookie2.get().theme);
			this.controller.get('userInfo').style.backgroundImage = props.URL;
			this.$.label3.style.addStyles({
				textColor: props.textColor
			});
			this.$.list1.style.addStyles({textColor: props.textColor});
		}
		this.showSpinner(false);
		this.getUserInfo();
		this.listMixes();
	},
	showSpinner: function(show) {
		if (!show) {
			this.feedMenuModel.items[0].items[1].width = 320;
			this.feedMenuModel.items[0].items[0].width = 0;
			this.controller.modelChanged(this.feedMenuModel, this);
		} else {
			this.feedMenuModel.items[0].items[1].width = 275;
			this.feedMenuModel.items[0].items[0].width = 45;
			this.controller.modelChanged(this.feedMenuModel, this);
		}
		this.$.spinner1.setSpinning(show);
	},
	listMixes: function() {
		var onComplete = function(transport) {
			if (transport.status === 200) {
				var mixes = transport.responseJSON.mixes;
				f = this.fillList(mixes);
				this.$.divider1.setLabel("Mixes (" + mixes.length + ")");
				this.controller.setWidgetModel("list1", f.getList());
			}
		};
		var onFailure = function(transport) {};
		url = "http://8tracks.com/users/" + this.userInfo.login + "/mixes.json";
		this.request(url, onComplete.bind(this), onFailure.bind(this));
	},
	getUserInfo: function() {
		var onComplete = function(transport) {
			if (transport.status === 200) {
				var image = transport.responseJSON.user.avatar_urls.sq100.toString() === "/images/avatars/sq100.jpg" ? Mojo.appPath + "/images/unknownUser.jpg" : transport.responseJSON.user.avatar_urls.sq100;
				this.$.picture1.setSrc(image);
				this.writeUserDetails(transport.responseJSON.user.bio_html, "");
				if (!transport.responseJSON.user.followed_by_current_user) {
					this.cmdMenuModel.items[0].items[2].label = "Follow";
					this.cmdMenuModel.items[0].items[2].command = "flw";
					this.controller.modelChanged(this.cmdMenuModel, this);
				} else {
					this.cmdMenuModel.items[0].items[2].label = "Unfollow";
					this.cmdMenuModel.items[0].items[2].command = "uflw";
					this.controller.modelChanged(this.cmdMenuModel, this);
				}
			}
		};
		var onFailure = function(transport) {
			this.popUp("Oops", "Error retrieving user data!");
		};
		url = "http://8tracks.com/users/" + this.userInfo.login + ".json";
		this.request(url, onComplete.bind(this), onFailure.bind(this));
	},
	request: function(url, onComplete, onFailure) {
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
	list1Listtap: function(inSender, event) {
		this.showSpinner(true);
		this.mixInfo = event.item.mixInfo;
		this.loadPlaylist();
	},
	loadPlaylist: function() {
		var onComplete = function(transport) {
			if (transport.status == 200) {
				this.token = transport.responseJSON.play_token;
				this.playMix();
			} else {
				this.popUp("Error", "Didn't Get 200 from json response");
			}
		};
		var onFailure = function() {
			this.popUp("Oops", "failed to get play_token");
		};
		var url = "http://8tracks.com/sets/new.json";
		this.request(url, onComplete.bind(this), onFailure.bind(this));
	},
	playMix: function() {
		var onComplete = function(transport) {
			if (transport.status == 200) {
				this.showSpinner(false);
				this.controller.stageController.pushScene('player', this.mixInfo, this.token, transport.responseJSON, this.mixInfo.cover_urls.original, this.setid, this.username.toLowerCase(), this.username, this.password);
			}
		};
		var onFailure = function(transport) {
			this.popUp("", "");
		};
		var url = "http://8tracks.com/sets/" + this.token + "/play.json?mix_id=" + this.mixInfo.id;
		this.request(url, onComplete.bind(this), onFailure.bind(this));
	},
	followUser: function() {
		var postdata = "login=" + this.username + "&password=" + this.password;
		//var postdata = this.token;
		var url = "http://8tracks.com/users/" + this.userInfo.id + "/follow.json";
		var onFailure = function(transport) {
			this.popUp("Error", "Could not follow user. Try to login again");
		};
		var myAjax = new Ajax.Request(url, {
			method: "post",
			requestHeader: postdata,
			onComplete: this.followedComplete.bind(this),
			onFailure: onFailure.bind(this)
		});
	},
	unFollowUser: function() {
		var postdata = "login=" + this.username + "&password=" + this.password;
		//var postdata = this.token;
		var url = "http://8tracks.com/users/" + this.userInfo.id + "/unfollow.json";
		var onFailure = function(transport) {
			this.popUp("Error", "Could not unfollow user. Try to login again");
		};
		var myAjax = new Ajax.Request(url, {
			method: "post",
			parameters: postdata,
			onComplete: this.unFollowedComplete.bind(this),
			onFailure: onFailure.bind(this)
		});
	},
	followedComplete: function(transport) {
		if (transport.responseJSON.status == "200 OK") {
			this.popUp("Success", "You are now following " + this.userInfo.login);
			this.cmdMenuModel.items[0].items[2].label = "Unfollow";
			this.cmdMenuModel.items[0].items[2].command = "uflw";
			this.controller.modelChanged(this.cmdMenuModel, this);
		} else {
			this.popUp(transport.responseJSON.status, transport.responseJSON.notices);
		}
	},
	unFollowedComplete: function(transport) {
		if (transport.responseJSON.status == "200 OK") {
			this.popUp("Success", "You have stopped following " + this.userInfo.login);
			this.cmdMenuModel.items[0].items[2].label = "Follow";
			this.cmdMenuModel.items[0].items[2].command = "flw";
			this.controller.modelChanged(this.cmdMenuModel, this);
		} else {
			this.popUp(transport.responseJSON.status, transport.responseJSON.notices);
		}
	}
};

UserInfoAssistant.prototype.handleCommand = function(event) {
	this.controller = Mojo.Controller.stageController.activeScene();
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
		case 'flw':
			this.followUser();
			break;
		case 'uflw':
			this.unFollowUser();
			break;
		}
	}
};