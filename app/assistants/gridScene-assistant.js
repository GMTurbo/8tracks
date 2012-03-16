function GridSceneAssistant(argFromPusher, pagecount, setid, loggedin, username, password, userid, mixtype) {
	this.loggedin = loggedin;
	this.userid = -1;
	this.mixCount = 5;
	if (loggedin) {
		this.userid = userid;
		this.username = username;
		this.password = password;
		this.mixCount = 9;
	}
	this.sCount = 1;
	this.tracks = argFromPusher;
	this.setid = setid;
	this.currentpage = 1;
	this.pagecount = pagecount;
	if (this.pagecount === 0) {
		this.pagecount = 1;
	}
	switch (mixtype) {
	case "featured":
		reload = true;
		this.sCount = 0;
		if (this.type !== "featured") {
			this.type = "featured";
			this.typelabel = "Featured";
		}
		break;
	case "recent":
		reload = true;
		this.sCount = 1;
		if (this.type !== "recent") {
			this.type = "recent";
			this.typelabel = "Latest";
		}
		break;
	case 'popular':
		this.sCount = 2;
		if (this.type !== "popular") {
			reload = true;
			this.type = "popular";
			this.typelabel = "Popular";
		}
		// popular
		break;
	case 'hot':
		// hot
		this.sCount = 3;
		if (this.type !== "hot") {
			reload = true;
			this.type = "hot";
			this.typelabel = "Hot";
		}
		break;
	case 'random':
		// random
		this.sCount = 4;
		if (this.type !== "random") {
			reload = true;
			this.type = "random";
			this.typelabel = "Random";
		}
		break;
	case 'liked':
		this.sCount = 5;
		if (this.type !== "liked") {
			reload = true;
			this.type = "liked";
			this.typelabel = "Liked";
		}
		break;
	case 'mine':
		this.sCount = 6;
		if (this.type !== "mine") {
			reload = true;
			this.type = "mine";
			this.typelabel = "My Mixes";
		}
		break;
	case 'followed':
		this.sCount = 7;
		if (this.type !== "followed") {
			reload = true;
			this.type = "followed";
			this.typelabel = "Following";
		}
		break;
	case 'mixfeed':
		this.sCount = 8;
		if (this.type !== "mixfeed") {
			reload = true;
			this.type = "mixfeed";
			this.typelabel = "Mix Feed";
		}
		break;
	}
	this.loaded = false;
	this.getNextMix = function(count, total) {
		return count % total;
	};

	this.pagecount = Math.round(parseInt(pagecount, 0) / 12);
	if (this.pagecount === 0) {
		this.pagecount = 1;
	}
	this.writeDescription = function() {
		if (this.typelabel == "My Mixes") {
			this.$.divider1.setLabel(this.typelabel + " (" + this.currentpage + "/" + this.pagecount + ")"); //Latest Mixes ( 1/10)
		} else {
			this.$.divider1.setLabel(this.typelabel + " Mixes (" + this.currentpage + "/" + this.pagecount + ")"); //Latest Mixes ( 1/10)
		}
		this.controller.get('scroller2').mojo.revealTop();
	};
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
	this.fillList = function(tracks, setid) {
		if (typeof setid !== "undefined") {
			this.setid = setid;
		}
		var list = new Array(tracks.length);
		for (var i = 0; i < tracks.length; i++) {
			list[i] = {
				title: tracks[i].name,
				leftImage: tracks[i].cover_urls.sq56.toString() === "/images/mix_covers/sq56.gif" ? Mojo.appPath + "/images/no_image.png" : tracks[i].cover_urls.sq56,
				tag: tracks[i].tag_list_cache,
				mixInfo: tracks[i],
				set_id: this.setid,
				type: "mix",
				//timeSince: new Date(tracks[i].first_published_at).toRelativeTime().toString() === "NaN years ago" ? "by " + tracks[i].user.login : new Date(tracks[i].first_published_at).toRelativeTime() + " by " + tracks[i].user.login
				timeSince: new Date(tracks[i].first_published_at).toRelativeTime().toString() === "NaN years ago" ? "" : new Date(tracks[i].first_published_at).toRelativeTime().toString(),
				creator: tracks[i].user.login
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

	this.fillUserList = function(users) {
		var list = new Array(users.length);
		for (var i = 0; i < users.length; i++) {
			var bio = "No Bio Info";
			if (users[i].bio_html !== null) {
				if (users[i].bio_html.indexOf("<p>") >= 0) {
					bio = users[i].bio_html.split("<p>")[1];
					bio = bio.split("</p>")[0];
				}
			}
			list[i] = {
				title: users[i].login,
				leftImage: users[i].avatar_urls.sq56.toString() === "/images/avatars/sq56.jpg" ? Mojo.appPath + "/images/no_image.png" : users[i].avatar_urls.sq56,
				tag: bio,
				mixID: users[i].id,
				type: "user",
				userinfo: users[i]
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
}

GridSceneAssistant.prototype = {
	setup: function() {
		this.cmdMenuModel = {
			visible: true,
			items: [
				{
				items: [{
					width: 30
				}]
			},
				{
				items: [{
					icon: "back",
					command: 'back',
					label: $L("Back"),
					disabled: this.currentpage === 1
				},{
					icon: "forward",
					command: 'fwd',
					label: $L("Forward"),
					disabled: this.currentpage === this.pagecount
				}]
			},
				{
				items: [{
					label: this.typelabel,
					command: 'type'
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
					label: "8tracks",
					width: 320
				}]
			}]
		};
		this.controller.setupWidget(Mojo.Menu.viewMenu, {
			spacerHeight: 0,
			menuClass: 'no-fade'
		},
		this.feedMenuModel);

		cookie2 = new Mojo.Model.Cookie("prefs");
		var thm = "none";
		if (cookie2.get()) {
			thm = cookie2.get().theme;
		}

		cookie3 = new Mojo.Model.Cookie("defaultMix");
		var defmix = "defmix:l";
		if (cookie3.get()) {
			defmix = cookie3.get().defaultMix;
		}
		this.appMenuModel = {
			items: [
				{
				label: this.loggedin ? "Logout " + this.username : "Login",
				command: this.loggedin ? 'logout' : 'login',
				shortcut: 'l'
			},
				{
				label: "Support",
				command: 'support'
			},/*
				{
				label: $L("Themes"),
				items: [
					{
					label: "Dark",
					command: 'dark',
					iconPath: thm == 'dark' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Light",
					command: 'lite',
					iconPath: thm == 'lite' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Light2",
					command: 'lite2',
					iconPath: thm == 'lite2' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Flat White",
					command: 'flat',
					iconPath: thm == 'flat' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Blue",
					command: 'blue',
					iconPath: thm == 'blue' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Red",
					command: 'red',
					iconPath: thm == 'red' ? Mojo.appPath + "/images/check_mark.png" : "none"
				}
					]
			},*/
				{
				label: $L("Default Mix"),
				items: [
					{
					label: "Featured",
					command: 'defmix:f',
					iconPath: defmix == 'defmix:f' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Latest",
					command: 'defmix:l',
					iconPath: defmix == 'defmix:l' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Popular",
					command: 'defmix:p',
					iconPath: defmix == 'defmix:p' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Hot",
					command: 'defmix:h',
					iconPath: defmix == 'defmix:h' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Random",
					command: 'defmix:r',
					iconPath: defmix == 'defmix:r' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Liked",
					command: 'defmix:liked',
					iconPath: defmix == 'defmix:liked' ? Mojo.appPath + "/images/check_mark.png" : "none",
					disabled: !this.loggedin
				},
					{
					label: "My Mixes",
					command: 'defmix:mm',
					iconPath: defmix == 'defmix:mm' ? Mojo.appPath + "/images/check_mark.png" : "none",
					disabled: !this.loggedin
				},
					{
					label: "Mix Feed",
					command: 'defmix:mf',
					iconPath: defmix == 'defmix:mf' ? Mojo.appPath + "/images/check_mark.png" : "none",
					disabled: !this.loggedin
				}
					]
			}
				]
		};
		this.controller.setupWidget(Mojo.Menu.appMenu, {},
		this.appMenuModel);
		this.controller.document.addEventListener("keyup", this.keyupHandler.bind(this), true);

		Ares.setupSceneAssistant(this);
	},
	cleanup: function() {
		this.controller.document.removeEventListener("keyup", this.keyupHandler.bind(this), true);
		Ares.cleanupSceneAssistant(this);
	},
	activate: function(response, username, password) {
		this.cookie2 = new Mojo.Model.Cookie("prefs");
		if (this.cookie2.get()) {
			props = themeLookup(this.cookie2.get().theme);
			this.controller.get('gridScene').style.backgroundImage = props.URL;
			this.$.list1.style.addStyles({
				textColor: props.textColor
			});
		}
		// JUST TYPE HANDLING
		if (justTypeInstance !== 0) {
			if (!mixLookup(justTypeInstance.criteria().mixType)) {
				// if the mixType doesn't exist, then go straight to searchin'
				search = justTypeInstance.criteria().mixType;
				justTypeInstance = 0; // we're done with it so get rid of it
				this.controller.stageController.pushScene('searchScrene', search, this.userid); // search
			} else {
				// the user wants to search a specific mix type, so let's do that
				this.autoOpenCriteria = justTypeInstance.criteria().searchTerm;
				mixtype = justTypeInstance.criteria().mixType;
				var listChange = true;
				if ((mixtype === "liked" && !this.loggedin) || (mixtype === "following" && !this.loggedin) || (mixtype === "my mixes" && !this.loggedin)) {
					capitaliseFirstLetter = function(string) {
						return string.charAt(0).toUpperCase() + string.slice(1);
					};
					this.showBanner(mixtype.indexOf("mixes") === -1 ? "login required to view " + capitaliseFirstLetter(mixtype) + " mixes" : "login required to view " + capitaliseFirstLetter(mixtype.split(" ")[0]) + " " + capitaliseFirstLetter(mixtype.split(" ")[1]));
					mixtype = "latest";
					listChange = false;
				}
				justTypeInstance = 0;
				if (listChange) {
					this.popupChoose(mixKey(mixtype));
				}
			}
		}

		if (response) {
			if (typeof response.search === "undefined") {
				if (typeof response.scene === "undefined") {
					this.loggedin = response.creds.loggedin;
					this.username = response.creds.username;
					this.password = response.creds.password;
					this.userid = response.creds.userid;
					this.appMenuModel.items[0].command = "logout";
					this.appMenuModel.items[0].label = "Logout " + this.username;
					this.appMenuModel.items[3].items[5].disabled = false;
					this.appMenuModel.items[3].items[6].disabled = false;
					this.appMenuModel.items[3].items[7].disabled = false;
					this.mixCount = 9;
					this.controller.modelChanged(this.appMenuModel, this);
				}
			}
		}
		if (!this.loaded) {
			//this.showBanner("Just Type to Search...");
			this.loaded = true;
		}
		if (this.type != "followed" && typeof response === "undefined") {
			f = this.fillList(this.tracks);
			//this.loremList = f.getList().items;
			//this.controller.modelChanged(this.loremListWidget,this);
			this.controller.setWidgetModel("list1", f.getList());
			this.writeDescription();
		} else if (typeof response.search === "undefined" && typeof response.username === "undefined" && typeof response.scene === "undefined") {
			var onComplete = function(transport) {
				if (transport.status === 200) {
					this.currentpage = 1;
					this.pagecount = Math.round(parseInt(transport.responseJSON.total_entries, 0) / 12);
					this.$.divider1.setLabel("Followed Users (" + this.currentpage + "/" + this.pagecount + ")");
					this.controller.get('scroller2').mojo.revealTop();
					this.cmdMenuModel.items[2].items[0].label = this.typelabel;
					this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
					this.cmdMenuModel.items[2].items[0].label = this.typelabel;
					this.controller.modelChanged(this.cmdMenuModel, this);
					f = this.fillUserList(transport.responseJSON.users);
					//this.loremList = f.getList().items;
					this.controller.setWidgetModel("list1", f.getList());
				}
				this.showSpinner(false);
			};
			var onFailure = function(transport) {
				this.popUp("Oops!", "Couldn't retreive page " + this.currentpage);
			};
			url = "http://8tracks.com/users/" + this.userid + "/follows_users.json&" + API_KEY;
			this.request(url, onComplete.bind(this), onFailure.bind(this));
		}

		if (typeof response !== "undefined") {
			if (typeof response.liked !== "undefined") {
				if (this.type === "liked") {
					this.popupChoose(mixKey("liked")); // repopulate liked list
				}
			}
		}
		this.showSpinner(false);
	},
	showBanner: function(message) {
		Mojo.Controller.getAppController().showBanner(message, {
			source: 'notification'
		});
	},
	keyupHandler: function(event) {
		if (Mojo.Char.isValidWrittenChar(event.keyCode) || Mojo.Char.isDigit(event.keyCode)) {
			if (event.srcElement.innerHTML.indexOf("mojo-scene-gridScene-scene-scroller") > 0 && event.srcElement.innerHTML.indexOf("mojo-scene-gridScene-scene-scroller") < 10) {
				this.controller.stageController.pushScene('searchScrene', event.keyCode, this.userid);
			}
		}
	},
	MixChange: function(direction) {
		var onComplete;
		var onFailure;
		this.sCount = this.getNextMix(this.sCount + direction, this.mixCount);
		if (this.sCount < 0) {
			this.sCount = this.mixCount - 1;
		} else if (this.sCount > this.mixCount) {
			this.sCount = 0;
		}
		switch (this.sCount) {
		case 0:
			reload = true;
			if (this.type !== "featured") {
				this.type = "featured";
				this.typelabel = "Featured";
			}
			break;
		case 1:
			reload = true;
			if (this.type !== "recent") {
				this.type = "recent";
				this.typelabel = "Latest";
			}
			break;
		case 2:
			if (this.type !== "popular") {
				reload = true;
				this.type = "popular";
				this.typelabel = "Popular";
			}
			// popular
			break;
		case 3:
			// hot
			if (this.type !== "hot") {
				reload = true;
				this.type = "hot";
				this.typelabel = "Hot";
			}
			break;
		case 4:
			// random
			if (this.type !== "random") {
				reload = true;
				this.type = "random";
				this.typelabel = "Random";
			}
			break;
		case 5:
			if (this.type !== "liked") {
				reload = true;
				this.type = "liked";
				this.typelabel = "Liked";
			}
			break;
		case 6:
			if (this.type !== "mine") {
				reload = true;
				this.type = "mine";
				this.typelabel = "My Mixes";
			}
			break;
		case 7:
			if (this.type !== "followed") {
				reload = true;
				this.type = "followed";
				this.typelabel = "Following";
			}
			break;
		case 8:
			if (this.type !== "mixfeed") {
				reload = true;
				this.type = "mixfeed";
				this.typelabel = "Mix Feed";
			}
			break;
		}
		if (reload && this.type !== "followed") {
			onComplete = function(transport) {
				this.currentpage = 1;
				this.controller.modelChanged(this.cmdMenuModel, this);
				this.tracks = transport.responseJSON.mixes;
				this.setid = transport.responseJSON.mix_set_id;
				if (this.type !== "featured") {
					this.pagecount = Math.ceil(parseInt(transport.responseJSON.total_entries, 0) / 12);
				} else {
					this.pagecount = Math.ceil(parseInt(transport.responseJSON.mix_set.total_entries, 0) / 12);
				}
				this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
				this.cmdMenuModel.items[1].items[1].disabled = this.currentpage === this.pagecount;
				this.cmdMenuModel.items[2].items[0].label = this.typelabel;
				this.controller.modelChanged(this.cmdMenuModel, this);
				this.writeDescription();
				f = this.fillList(this.tracks, transport.responseJSON.mix_set_id);
				this.controller.setWidgetModel("list1", f.getList());
				this.showSpinner(false);
			};
			onFailure = function(transport) {
				this.showSpinner(false);
				this.popUp("Oops!", "Couldn't retreive page " + this.currentpage);
			};
			url = "";
			if (this.type === "liked") {
				url = "http://8tracks.com/users/" + this.userid + "/mixes.json&"+API_KEY+"?view=liked";
			} else if (this.type === "mine") {
				url = "http://8tracks.com/users/" + this.userid + "/mixes.json&"+API_KEY;
			} else if (this.type === "featured") {
				url = "http://8tracks.com/mix_sets/featured.json&"+API_KEY+"?page=1";
			} else if (this.type === "mixfeed") {
				url = "http://8tracks.com/users/" + this.userid + "/mixes.json&"+API_KEY+"?view=mix_feed&per_page=12";
			} else {
				url = "http://8tracks.com/mixes.json&"+API_KEY+"?page=1&sort=" + this.type;
			}
			this.request(url, onComplete.bind(this), onFailure.bind(this));
		} else if (reload && this.type === "followed") {
			onComplete = function(transport) {
				if (transport.status === 200) {
					this.currentpage = 1;
					this.pagecount = Math.ceil(parseInt(transport.responseJSON.total_entries, 0) / 12);
					this.$.divider1.setLabel("Followed Users (" + this.currentpage + "/" + this.pagecount + ")"); //Latest Mixes ( 1/10)
					this.controller.get('scroller2').mojo.revealTop();
					this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
					this.cmdMenuModel.items[1].items[1].disabled = this.currentpage === this.pagecount;
					this.cmdMenuModel.items[2].items[0].label = this.typelabel;
					this.controller.modelChanged(this.cmdMenuModel, this);
					f = this.fillUserList(transport.responseJSON.users);
					this.controller.setWidgetModel("list1", f.getList());
				}
				this.showSpinner(false);
			};
			onFailure = function(transport) {
				this.popUp("Oops!", "Couldn't retreive page " + this.currentpage);
			};
			url = "http://8tracks.com/users/" + this.userid + "/follows_users.json&"+API_KEY;
			this.request(url, onComplete.bind(this), onFailure.bind(this));
		}
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
	popupChoose: function(event) {
		var onComplete;
		var onFailure;
		var reload = false;
		switch (event) {
		case "featured":
			reload = true;
			this.sCount = 0;
			if (this.type !== "featured") {
				this.type = "featured";
				this.typelabel = "Featured";
			}
			break;
		case "l_mixes":
			reload = true;
			this.sCount = 1;
			if (this.type !== "recent") {
				this.type = "recent";
				this.typelabel = "Latest";
			}
			break;
		case 'p_mixes':
			this.sCount = 2;
			if (this.type !== "popular") {
				reload = true;
				this.type = "popular";
				this.typelabel = "Popular";
			}
			// popular
			break;
		case 'h_mixes':
			// hot
			this.sCount = 3;
			if (this.type !== "hot") {
				reload = true;
				this.type = "hot";
				this.typelabel = "Hot";
			}
			break;
		case 'r_mixes':
			// random
			this.sCount = 4;
			if (this.type !== "random") {
				reload = true;
				this.type = "random";
				this.typelabel = "Random";
			}
			break;
		case 'liked':
			reload = true;
			this.sCount = 5;
			if (this.type !== "liked") {
				this.type = "liked";
				this.typelabel = "Liked";
			}
			break;
		case 'mine':
			this.sCount = 6;
			if (this.type !== "mine") {
				reload = true;
				this.type = "mine";
				this.typelabel = "My Mixes";
			}
			break;
		case 'followed':
			this.sCount = 7;
			if (this.type !== "followed") {
				reload = true;
				this.type = "followed";
				this.typelabel = "Following";
			}
			break;
		case 'mixfeed':
			this.sCount = 8;
			if (this.type !== "mixfeed") {
				reload = true;
				this.type = "mixfeed";
				this.typelabel = "Mix Feed";
			}
			break;
		}
		if (reload && this.type !== "followed") {
			onComplete = function(transport) {
				this.currentpage = 1;
				this.tracks = transport.responseJSON.mixes;
				this.setid = transport.responseJSON.mix_set_id;
				if (this.type !== "featured") {
					this.pagecount = Math.ceil(parseInt(transport.responseJSON.total_entries, 0) / 12);
				} else {
					this.pagecount = Math.ceil(parseInt(transport.responseJSON.mix_set.total_entries, 0) / 12);
				}
				this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
				this.cmdMenuModel.items[1].items[1].disabled = this.currentpage === this.pagecount;
				this.cmdMenuModel.items[2].items[0].label = this.typelabel;
				this.controller.modelChanged(this.cmdMenuModel, this);
				this.writeDescription();
				f = this.fillList(this.tracks, transport.responseJSON.mix_set_id);
				this.controller.setWidgetModel("list1", f.getList());
				this.showSpinner(false);
			};
			onFailure = function(transport) {
				this.showSpinner(false);
				this.popUp("Oops!", "Couldn't retreive page " + this.currentpage);
			};
			url = "";
			if (this.type === "liked") {
				url = "http://8tracks.com/users/" + this.userid + "/mixes.json?view=liked&"+ API_KEY;
			} else if (this.type === "mine") {
				url = "http://8tracks.com/users/" + this.userid + "/mixes.json";
			} else if (this.type === "featured") {
				url = "http://8tracks.com/mix_sets/featured.json?page=1&"+API_KEY;
			} else if (this.type === "mixfeed") {
				url = "http://8tracks.com/users/" + this.userid + "/mixes.json?view=mix_feed&per_page=12&" + API_KEY;
			}	else {
				url = "http://8tracks.com/mixes.json?page=1&sort=" + this.type + "&"+ API_KEY;
			}
			this.request(url, onComplete.bind(this), onFailure.bind(this));
		} else if (reload && this.type === "followed") {
			onComplete = function(transport) {
				if (transport.status === 200) {
					this.currentpage = 1;
					this.pagecount = Math.ceil(parseInt(transport.responseJSON.total_entries, 0) / 12);
					this.$.divider1.setLabel("Followed Users (" + this.currentpage + "/" + this.pagecount + ")"); //Latest Mixes ( 1/10)
					this.controller.get('scroller2').mojo.revealTop();
					this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
					this.cmdMenuModel.items[1].items[1].disabled = this.currentpage === this.pagecount;
					this.cmdMenuModel.items[2].items[0].label = this.typelabel;
					this.controller.modelChanged(this.cmdMenuModel, this);
					f = this.fillUserList(transport.responseJSON.users);
					this.controller.setWidgetModel("list1", f.getList());
				}
				this.showSpinner(false);
			};
			onFailure = function(transport) {
				this.popUp("Oops!", "Couldn't retreive page " + this.currentpage);
			};
			url = "http://8tracks.com/users/" + this.userid + "/follows_users.json&"+API_KEY;
			this.request(url, onComplete.bind(this), onFailure.bind(this));
		}
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
	getPreviousPage: function() {
		if (this.currentpage - 1 > 0) {
			this.currentpage -= 1;
			var onComplete = function(transport) {
				this.pagecount = Math.ceil(parseInt(transport.responseJSON.total_entries, 0) / 12);
				this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
				this.cmdMenuModel.items[1].items[1].disabled = this.currentpage === this.pagecount;
				this.controller.modelChanged(this.cmdMenuModel, this);
				this.tracks = transport.responseJSON.mixes;
				this.writeDescription();
				f = this.fillList(this.tracks);
				this.controller.setWidgetModel("list1", f.getList());
				this.showSpinner(false);
			};
			var onFailure = function(transport) {
				this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
				this.controller.modelChanged(this.cmdMenuModel, this);
				this.showSpinner(false);
				this.popUp("Oops!", "Couldn't retreive page " + this.currentpage);
			};
			if (this.type === "liked") {
				url = "http://8tracks.com/users/" + this.userid + "/mixes.json?view=liked&page=" + this.currentpage + "&" + API_KEY;
			} else if (this.type === "featured") {
				url = "http://8tracks.com/mix_sets/featured.json?per_page=10&page=" + this.currentpage+ "&" + API_KEY;
			} else if (this.type === "mixfeed") {
				url = "http://8tracks.com/users/" + this.userid + "/mixes.json?view=mix_feed&page=" + this.currentpage + "&per_page=12&" + API_KEY;
			}	else {
				url = "http://8tracks.com/mixes.json?page=" + this.currentpage + "&sort=" + this.type+ "&" + API_KEY;
			}
			this.request(url, onComplete.bind(this), onFailure.bind(this));
		}
	},
	getNextPage: function() {
		this.currentpage += 1;
		var onComplete = function(transport) {
			this.pagecount = Math.ceil(parseInt(transport.responseJSON.total_entries, 0) / 12);
			this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
			this.cmdMenuModel.items[1].items[1].disabled = this.currentpage === this.pagecount;
			this.controller.modelChanged(this.cmdMenuModel, this);
			this.tracks = transport.responseJSON.mixes;
			this.writeDescription();
			f = this.fillList(this.tracks);
			this.controller.setWidgetModel("list1", f.getList());
			this.showSpinner(false);
		};
		var onFailure = function(transport) {
			this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
			this.cmdMenuModel.items[1].items[1].disabled = this.currentpage === this.pagecount;
			this.cmdMenuModel.items[2].items[0].label = this.typelabel;
			this.showSpinner(false);
			this.popUp("Oops!", "Couldn't retreive page " + this.currentpage);
		};
		if (this.type === "liked") {
			url = "http://8tracks.com/users/" + this.userid + "/mixes.json?view=liked&page=" + this.currentpage+ "&" + API_KEY;
		} else if (this.type === "featured") {
			url = "http://8tracks.com/mix_sets/featured.json?page=" + this.currentpage+ "&" + API_KEY;
		} else if (this.type === "mixfeed") {
			url = "http://8tracks.com/users/" + this.userid + "/mixes.json?view=mix_feed&page=" + this.currentpage + "&per_page=12&" + API_KEY;
		} else {
			url = "http://8tracks.com/mixes.json?page=" + this.currentpage + "&sort=" + this.type+ "&" + API_KEY;
		}
		this.request(url, onComplete.bind(this), onFailure.bind(this));
	},
	list1Listtap: function(inSender, event) {
		if (event.originalEvent.target.id === "creator") {
			user = event.originalEvent.target.innerText.replace("by ", "");
			this.controller.stageController.pushScene('userInfo', {
				login: user
			},
			this.userid, this.username, this.password);
		} else if (event.originalEvent.target.className.toString().indexOf("floatleft") >= 0) {
			this.loadPlaylist(event.item.mixInfo);
			this.controller.stageController.pushScene('mixDetailsScene', event.item.mixInfo, event.item.set_id, this.userid, this.username, this.password, true);
		} else if (event.item.type === "mix") {
			this.controller.stageController.pushScene('mixDetailsScene', event.item.mixInfo, event.item.set_id, this.userid, this.username, this.password);
		} else {
			this.controller.stageController.pushScene('userInfo', event.item.userinfo, this.userid, this.username, this.password);
		}
	},
	playMix: function(mixinfo) {
		var onComplete = function(transport) {
			if (transport.status == 200) {
				this.showSpinner(false);
				launch8tracksPlayer = function() {
					var parameters = {
						id: 'com.mycompany.8tracks',
						params: {
							launchScene: 'player',
							mixInfo: mixinfo,
							token: this.token,
							response: transport.responseJSON,
							cover: mixinfo.cover_urls.max200,
							setid: this.setid, 
							userid: this.userid,
							username: this.username,
							password: this.password, 
							liked: mixinfo.liked_by_current_user
						}
					};
					return new Mojo.Service.Request('palm://com.palm.applicationManager', {
						method: 'open',
						parameters: parameters
					});
				};
				launch8tracksPlayer();
				//this.controller.stageController.pushScene('player', mixinfo, this.token, transport.responseJSON, mixInfo.cover_urls.max200, this.setid, this.userid, this.username, this.password, mixinfo.liked_by_current_user);
			}
		};
		var onFailure = function(transport) {
			this.showSpinner(false);
			this.popUp(transport.responseJSON.status, transport.responseJSON.notices[0]);
		};
		var url = "http://8tracks.com/sets/" + this.token + "/play.json?mix_id=" + mixinfo.id + "&" + API_KEY;
		this.request(url, onComplete.bind(this), onFailure.bind(this));
	},
	loadPlaylist: function(mixInfo) {
		var onComplete = function(transport) {
			if (transport.status == 200) {
				this.token = transport.responseJSON.play_token;
				this.playMix(mixInfo);
			} else {
				this.popUp("Error", "Didn't Get 200 from json response");
			}
		};
		var onFailure = function() {
			this.showSpinner(false);
			this.popUp("Oops", "failed to get play_token");
		};
		var url = "http://8tracks.com/sets/new.json";
		this.request(url, onComplete.bind(this), onFailure.bind(this));
	},
	list1Listdelete: function(inSender, event) {
		if (this.type !== "liked") {
			event.stop();
		} else {
			this.UnLike(event.item.mixInfo.id);
		}
	},
	UnLike: function(mixid) {
		var onFailure = function(transport) {
			this.popUp("Error", "Could not remove mix to your liked mix. Try to login again");
		};
		var postdata = "login=" + this.username + "&password=" + this.password;
		url = "http://8tracks.com/mixes/" + mixid + "/unlike.json&"+API_KEY;
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
				this.showBanner("Mix removed from your Liked list");
			}
		} else {
			this.showBanner(response.responseJSON.status, response.responseJSON.notices);
		}
	}
};

GridSceneAssistant.prototype.handleCommand = function(event) {
	this.controller = Mojo.Controller.stageController.activeScene();
	var resetCheck = function(command) {
		for (i = 0; i < this.appMenuModel.items[2].items.length; i++) {
			if (this.appMenuModel.items[2].items[i].command == command) {
				this.appMenuModel.items[2].items[i].iconPath = Mojo.appPath + "/images/check_mark.png";
			} else {
				this.appMenuModel.items[2].items[i].iconPath = "none";
			}
		}
	}.bind(this);

	var resetDefaultMix = function(command) {
		for (i = 0; i < this.appMenuModel.items[2].items.length; i++) {
			if (this.appMenuModel.items[2].items[i].command == command) {
				this.appMenuModel.items[2].items[i].iconPath = Mojo.appPath + "/images/check_mark.png";
			} else {
				this.appMenuModel.items[2].items[i].iconPath = "none";
			}
		}
	}.bind(this);

	if (event.type == Mojo.Event.command) {
		switch (event.command) {
		case 'fwd':
			if (this.currentpage < this.pagecount) {
				this.getNextPage();
			}
			break;
		case 'back':
			if (this.currentpage !== 1) {
				this.getPreviousPage();
			}
			break;
		case 'search':
			this.controller.stageController.pushScene('searchScrene');
			break;
		case 'dark':
			this.cookie = new Mojo.Model.Cookie("prefs");
			this.cookie.put({
				theme: event.command
			});
			props = themeLookup(event.command);
			this.controller.get('gridScene').style.backgroundImage = props.URL;
			this.$.list1.style.addStyles({
				textColor: props.textColor
			});
			resetCheck(event.command);
			break;
		case 'lite':
			this.cookie = new Mojo.Model.Cookie("prefs");
			this.cookie.put({
				theme: event.command
			});
			props = themeLookup(event.command);
			this.controller.get('gridScene').style.backgroundImage = props.URL;
			this.$.list1.style.addStyles({
				textColor: props.textColor
			});
			resetCheck(event.command);
			break;
		case 'lite2':
			this.cookie = new Mojo.Model.Cookie("prefs");
			this.cookie.put({
				theme: event.command
			});
			props = themeLookup(event.command);
			this.controller.get('gridScene').style.backgroundImage = props.URL;
			this.$.list1.style.addStyles({
				textColor: props.textColor
			});
			resetCheck(event.command);
			break;
		case 'flat':
			this.cookie = new Mojo.Model.Cookie("prefs");
			this.cookie.put({
				theme: event.command
			});
			props = themeLookup(event.command);
			this.controller.get('gridScene').style.backgroundImage = props.URL;
			this.$.list1.style.addStyles({
				textColor: props.textColor
			});
			resetCheck(event.command);
			break;
		case 'blue':
			this.cookie = new Mojo.Model.Cookie("prefs");
			this.cookie.put({
				theme: event.command
			});
			props = themeLookup(event.command);
			this.controller.get('gridScene').style.backgroundImage = props.URL;
			this.$.list1.style.addStyles({
				textColor: props.textColor
			});
			resetCheck(event.command);
			break;
		case 'red':
			this.cookie = new Mojo.Model.Cookie("prefs");
			this.cookie.put({
				theme: event.command
			});
			props = themeLookup(event.command);
			this.controller.get('gridScene').style.backgroundImage = props.URL;
			this.$.list1.style.addStyles({
				textColor: props.textColor
			});
			resetCheck(event.command);
			break;
		case 'login':
			this.controller.stageController.pushScene('login');
			break;
		case 'logout':
			this.showBanner("You have logged out");
			logout();
			/*this.cookie = new Mojo.Model.Cookie("credentials");
			this.cookie.put({
				username: "",
				password: "",
				token: 0,
				userid: -1
			});*/
			this.loggedin = false;
			this.username = "";
			this.password = "";
			this.userid = -1;
			this.mixCount = 4;
			this.appMenuModel.items[0].command = "login";
			this.appMenuModel.items[0].label = "Login";
			//this.appMenuModel.items[3].items[5].disabled = true;
		//	this.appMenuModel.items[3].items[6].disabled = true;
			this.controller.modelChanged(this.appMenuModel, this);
			cookie3 = new Mojo.Model.Cookie("defaultMix");
			cookie3.put({
				defaultMix: 'defmix:l'
			});
			resetDefaultMix('defmix:l');
			break;
		case 'support':
			this.controller.serviceRequest("palm://com.palm.applicationManager", {
				method: 'open',
				parameters: {
					id: "com.palm.app.email",
					params: {
						summary: "8tracks Support Request: v" + Mojo.Controller.appInfo.version,
						recipients: [{
							type: "email",
							role: 1,
							value: "GTestaSoftware@gmail.com",
							contactDisplay: "8tracks Support"
						}]
					}
				}
			});
			break;
		case 'type':
			this.controller.popupSubmenu({
				onChoose: this.popupChoose,
				placeNear: event.originalEvent.target,
				items: [
					{
					label: 'Featured',
					command: 'featured',
					iconPath: this.type == 'featured' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: 'Latest',
					command: 'l_mixes',
					iconPath: this.type == 'recent' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: 'Popular',
					command: 'p_mixes',
					iconPath: this.type == 'popular' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: 'Hot',
					command: 'h_mixes',
					iconPath: this.type == 'hot' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: 'Random',
					command: 'r_mixes',
					iconPath: this.type == 'random' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: 'Liked',
					command: 'liked',
					disabled: !this.loggedin,
					iconPath: this.type == 'liked' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: 'My Mixes',
					command: 'mine',
					disabled: !this.loggedin,
					iconPath: this.type == 'mine' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: 'Following',
					command: 'followed',
					disabled: !this.loggedin,
					iconPath: this.type == 'followed' ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: 'Mix Feed',
					command: 'mixfeed',
					disabled: !this.loggedin,
					iconPath: this.type == 'mixfeed' ? Mojo.appPath + "/images/check_mark.png" : "none"
				}]
			});
			break;
		case 'defmix:f':
			this.cookie3 = new Mojo.Model.Cookie("defaultMix");
			this.cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case 'defmix:l':
			this.cookie3 = new Mojo.Model.Cookie("defaultMix");
			this.cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case 'defmix:r':
			this.cookie3 = new Mojo.Model.Cookie("defaultMix");
			this.cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case 'defmix:h':
			this.cookie3 = new Mojo.Model.Cookie("defaultMix");
			this.cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case 'defmix:p':
			this.cookie3 = new Mojo.Model.Cookie("defaultMix");
			this.cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case 'defmix:liked':
			this.cookie3 = new Mojo.Model.Cookie("defaultMix");
			this.cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case 'defmix:mm':
			this.cookie3 = new Mojo.Model.Cookie("defaultMix");
			this.cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case 'defmix:mf':
			this.cookie3 = new Mojo.Model.Cookie("defaultMix");
			this.cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case 'defmix:fol':
			this.cookie3 = new Mojo.Model.Cookie("defaultMix");
			this.cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		}
	} else if (event.type === Mojo.Event.back) {
		event.stop();
		this.MixChange(-1);
	} else if (event.type === Mojo.Event.forward) {
		event.stop();
		this.MixChange(1);
	}
};