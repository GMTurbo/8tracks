function MixDetailsSceneAssistant(argFromPusher, setid, userid, username, password, launchie) {
	MixScreneCount += 1;
	this.userid = -1;
	if(typeof launchie !=="undefined"){
		this.launchie=launchie;
	}
	if (userid !== -1) {
		this.loggedin = true;
		this.userid = userid;
		this.username = username;
		this.password = password;
		this.cookie = new Mojo.Model.Cookie("credentials");
		if (this.cookie.get()) {
			this.token = this.cookie.get().token;
		}
	}
	this.mixInfo = argFromPusher;
	this.liked = this.mixInfo.liked_by_current_user;
	this.setid = setid;
	this.writeDetails = function(name, description, tags) {
		this.$.name.setLabel(name);
		this.$.description.setLabel(description);
		var fillTagGrid = function(tags) {
			list = [];
			step = Math.floor(tags.length / 3, 0);
			for (i = 0; i < step; i++) {
				list.push({
					tag1: tags[3 * i],
					tag2: tags[3 * i + 1],
					tag3: tags[3 * i + 2]
				});
			}
			ret = 0;
			//get remaining tags
			count = tags.length - (3 * step);
			var remainder;
			switch (count) {
			case 1:
				remainder = {
					tag1: tags[tags.length - 1]
				};
				list.push(remainder);
				ret = 1;
				break;
			case 2:
				remainder = {
					tag1: tags[tags.length - 2],
					tag2: tags[tags.length - 1]
				};
				list.push(remainder);
				ret = 2;
				break;
			}

			listModel = {
				items: list
			};
			return {
				getList: function() {
					return listModel;
				},
				getBadTagCount: function(){
					return ret;
				}
			};
		};
		this.controller.setWidgetModel("list1", fillTagGrid(tags.split(",")).getList());
		return fillTagGrid(tags.split(",")).getBadTagCount();
	};
	this.setPicture = function(picture) {
		this.controller.setWidgetModel("html1", {
			pic: picture
		});
	};
	this.setUserInfo = function(info) {
		this.$.creator.setLabel(info);
	};
	this.checkBoxState = function(checked) {
		this.$.checkBox1.setValue(checked);
	};
	this.showBanner = function(message) {
		Mojo.Controller.getAppController().showBanner(message, {
			source: 'notification'
		});
	};
	this.popUp = function(title, message) {
		this.showBanner(message);
	};
}

MixDetailsSceneAssistant.prototype = {
	setup: function() {
				this.cmdMenuModel = {
					visible: true,
					items: [
						{
						items: [{
							iconPath: 'images/user_info.png',
							label: $L('Info'),
							command: 'info'
						}]
					},
						{
						items: [{
							width: 45,
							iconPath: this.liked ? 'images/mixunlikeheart1.png' : 'images/mixlikeheart2.png',
							label: this.liked ? $L('Unlike') : $L('Like'),
							command: this.liked ? 'unlike' : 'like',
							disabled: this.userid == -1
						}]
					},
						{
						items: [{
							iconPath: Mojo.appPath + "/images/playselected.png",
							label: $L('Listen'),
							command: 'play',
							disabled: this.launchie
						}]
					}]
				};

		this.controller.setupWidget(Mojo.Menu.commandMenu, {
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
					label: this.mixInfo.name,
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

		this.appMenuModel = {
			items: [
				{
				label: "Share Mix...",
				command: 'share'
			}
				]
		};
		this.controller.setupWidget(Mojo.Menu.appMenu, {},
		this.appMenuModel);
		Ares.setupSceneAssistant(this);
	},
	cleanup: function() {
		Ares.cleanupSceneAssistant(this);
	},
	activate: function(data) {
		//this.controller.get("picture1").style.cssText += "-webkit-border-radius:12px";
		this.cookie2 = new Mojo.Model.Cookie("prefs");
		if (this.cookie2.get()) {
			props = themeLookup(this.cookie2.get().theme);
			this.controller.get('mixDetailsScene').style.backgroundImage = props.URL;
			//this.$.list1.style.addStyles({
			//textColor: props.textColor
			//});
			this.$.name.style.addStyles({
				textColor: props.textColor
			});
			this.$.description.style.addStyles({
				textColor: props.textColor
			});
			this.$.creator.style.addStyles({
				textColor: props.textColor
			});
		}

		if (typeof data !== "undefined") {
			if (data.mixInfo.name != this.mixInfo.name) {
				this.mixInfo = data.mixInfo;
				this.feedMenuModel.items[0].items[1].label = this.mixInfo.name;
				this.controller.modelChanged(this.feedMenuModel, this);
			}
			if (this.loggedin && this.liked !== data.likedMix) {
				response = {
					responseJSON: {
						status: "200 OK",
						bypass: true
					}
				};
				if (data.likedMix) {
					this.LikedComplete(response);
				} else {
					this.UnLikedComplete(response);
				}
				if (typeof data.error !== "undefined") {
					switch (data.error) {
					case 1:
						break;
					case 2:
						break;
					case 3:
						break;
					default:
						this.showBanner("There was an error playing that last mix!");
						break;
					}
				}
			}
		}
		this.showSpinner(false);
		count = this.writeDetails(this.mixInfo.name, this.mixInfo.description, this.mixInfo.tag_list_cache);
		dat = {
			pic: this.mixInfo.user.avatar_urls.sq100.toString() === "/images/avatars/sq100.jpg" ? Mojo.appPath + "/images/unknownUser.jpg" : this.mixInfo.user.avatar_urls.sq100
		};
		this.controller.setWidgetModel("html1", dat);
		this.setUserInfo(this.mixInfo.user.login);
		if(this.launchie){
			if(MixScreneCount === 1){
				this.showBanner("Mix Launching in New Card");
				MixScreneCount+=1;
				}
				var self = this;
				this.controller.window.setTimeout(function(){
				self.cmdMenuModel.items[2].items[0].disabled = false;
				self.controller.modelChanged(self.cmdMenuModel, self);
				},5000);
		}
		//this.setUserInfo(this.mixInfo.user.login);
		//this.cmdMenuModel.items[2].items[0].disabled = false;
		//this.controller.modelChanged(this.cmdMenuModel, this);
	},
	finishedDad: function(data){
		if(typeof data.message !== "undefined"){
			this.showBanner(data.message);
		}
		this.cmdMenuModel.items[2].items[0].disabled = data.state;
		this.controller.modelChanged(this.cmdMenuModel, this);
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
	request: function(url, onComplete, onFailure) {
		this.showSpinner(true);
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
	playMix: function() {
		var onComplete = function(transport) {
			if (transport.status == 200) {
				this.showSpinner(false);
				launch8tracksPlayer = function(mixInfo, token, transport, setid, creds, liked) {
					var parameters = {
						id: 'com.mycompany.8tracks',
						params: {
							launchScene: 'player',
							mixInfo: mixInfo,
							token: token,
							response: transport.responseJSON,
							cover: mixInfo.cover_urls.max200,
							setid: setid, 
							userid: creds.userid,
							username: creds.username,
							password: creds.password, 
							liked: liked
						}
					};
					return new Mojo.Service.Request('palm://com.palm.applicationManager', {
						method: 'open',
						parameters: parameters
					});
				};
				launch8tracksPlayer(this.mixInfo, this.token, transport, this.setid, {username:this.username, password:this.password, userid: this.userid}, this.liked);
				
				//this.controller.stageController.pushScene('player', this.mixInfo, this.token, transport.responseJSON, this.mixInfo.cover_urls.max200, this.setid, this.userid, this.username, this.password, this.cmdMenuModel.items[1].items[0].command);
			}
		};
		var onFailure = function(transport) {
			this.showSpinner(false);
			this.popUp(transport.responseJSON.status, transport.responseJSON.notices[0]);
		};
		var url = "http://8tracks.com/sets/" + this.token + "/play.json?mix_id=" + this.mixInfo.id;
		this.request(sendURL(url), onComplete.bind(this), onFailure.bind(this));
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
			this.showSpinner(false);
			this.popUp("Oops", "failed to get play_token");
		};
		var url = "http://8tracks.com/sets/new.json";
		this.request(sendURL(url,true), onComplete.bind(this), onFailure.bind(this));
	},
	Like: function() {
		var onFailure = function(transport) {
			this.popUp("Error", "Could not add mix to your liked mix. Try to login again");
		};

		var postdata = "login=" + this.username + "&password=" + this.password;
		var url = "http://8tracks.com/mixes/" + this.mixInfo.id + "/like.json";
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
			if (typeof response.responseJSON.bypass === "undefined") {
				this.popUp("Success", "Mixed added to your Liked list");
			}
			this.likedtoggle = true;
			this.liked = true;
			this.cmdMenuModel.items[1].items[0].iconPath = 'images/mixunlikeheart1.png';
			this.cmdMenuModel.items[1].items[0].label = "Unlike";
			this.cmdMenuModel.items[1].items[0].command = "unlike";
			this.controller.modelChanged(this.cmdMenuModel, this);
		} else {
			this.popUp(response.responseJSON.status, response.responseJSON.notices);
		}
	},
	UnLike: function() {
		var onFailure = function(transport) {
			this.popUp("Error", "Could not remove mix to your liked mix. Try to login again");
		};
		var postdata = "login=" + this.username + "&password=" + this.password;
		url = "http://8tracks.com/mixes/" + this.mixInfo.id + "/unlike.json";
		url = sendURL(url,true);
		var myAjax = new Ajax.Request(url, {
			method: "post",
			requestHeader: postdata,
			onComplete: this.UnLikedComplete.bind(this),
			onFailure: onFailure.bind(this)
		});
	},
	UnLikedComplete: function(response) {
		if (response.responseJSON.status === "200 OK") {
			if (typeof response.responseJSON.bypass === "undefined") {
				this.popUp("Success", "Mixed removed from your Liked list");
			}
			this.likedtoggle = true;
			this.liked = false;
			this.cmdMenuModel.items[1].items[0].iconPath = 'images/mixlikeheart2.png';
			this.cmdMenuModel.items[1].items[0].label = "Like";
			this.cmdMenuModel.items[1].items[0].command = "like";
			this.controller.modelChanged(this.cmdMenuModel, this);
		} else {
			this.popUp(response.responseJSON.status, response.responseJSON.notices);
		}
	},
	list1Listtap: function(inSender, event) {
		//get the actual words and forget the empty spaces
		searchVar = event.originalEvent.target.innerText;
		if (typeof searchVar !== "undefined") {
			if (searchVar.length > 0) {
				found = function(arr, string) {
					for (i = 0; i < arr.length; i++) {
						if (arr[i].sceneName === string) {
							return true;
						}
					}
					return false;
				};

				if (found(this.controller.stageController.getScenes(), 'searchScrene')) {
					this.controller.stageController.popScenesTo('searchScrene', {keyword: searchVar}); // prevent recursion
				} else {
					this.controller.stageController.pushScene('searchScrene', searchVar, this.userid, "Genre"); // search
				}
			}
		}
	}
};

MixDetailsSceneAssistant.prototype.handleCommand = function(event) {
	this.controller = Mojo.Controller.stageController.activeScene();
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
		case 'play':
			this.loadPlaylist();
			break;
		case 'info':
			this.controller.stageController.pushScene('userInfo', this.mixInfo.user, this.userid, this.username, this.password);
			break;
		case 'like':
			this.Like();
			break;
		case 'unlike':
			this.UnLike();
			break;
		case 'share':
			/*this.controller.serviceRequest("palm://com.palm.applicationManager", {
				method: 'open',
				parameters: {
					id: "com.palm.app.email",
					params: {
						summary: "Checkout this 8tracks mix!",
						text: "Checkout this Mix: \n" + this.mixInfo.name + "\nwww.8tracks.com" + this.mixInfo.path
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
						text: "<b>" + this.mixInfo.name + "</b><br><br><i>" + this.mixInfo.description + "</i><br><br><a href=\"www.8tracks.com"+this.mixInfo.path+"\">"+"Listen to this!"+"</a>"
					}
				}
			});
			break;
		}
	} else if (event.type === Mojo.Event.back) {
		var data;
		if(typeof this.likedtoggle!=="undefined"){
			data = {
				search: true,
				liked: this.liked
			};
		}else{
			data = {
				search: true
			};
		}
		event.stop();
		this.controller.stageController.popScene(data);
	}
};