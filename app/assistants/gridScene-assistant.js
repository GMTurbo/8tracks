function GridSceneAssistant(argFromPusher, pagecount, setid, loggedin, username, password, userid) {
	this.loggedin = loggedin;
	this.userid = -1;
	this.mixCount = 4;
	if (loggedin) {
		this.userid = userid;
		this.username = username;
		this.password = password;
		this.mixCount = 7;
	}
	this.sCount = 1;
	this.tracks = argFromPusher;
	this.setid = setid;
	this.currentpage = 1;
	this.type = "recent";
	this.typelabel = "Latest";
	this.loaded = false;
	this.getNextMix = function(count, total) {
		return count % total;
	};

	this.pagecount = Math.round(parseInt(pagecount, 0) / 10);
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
				mixInfo: tracks[i],
				set_id: this.setid,
				type: "mix"
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
					if (bio.length > 50) {
						bio = bio.substring(0, 50) + "...";
					}
				}
			}
			list[i] = {
				title: users[i].login,
				leftImage: users[i].avatar_urls.sq56.toString() === "/images/avatars/sq56.jpg" ? Mojo.appPath + "/images/no_image.png" : users[i].avatar_urls.sq56,
				tag: bio,
				mixID: users[i].id,
				type: "user",
				userinfo: users[i]
				//set_id: this.setid
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
					label: $L("Forward")
				}]
			},
				{
				items: [{
					label: 'Latest',
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

		this.cookie2 = new Mojo.Model.Cookie("prefs");
		var thm = "none";
		if (this.cookie2.get()) {
			thm = this.cookie2.get().theme
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
			},
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
		if (response) {
			if (typeof response.search === "undefined") {
				this.loggedin = response.loggedin;
				this.username = response.username;
				this.password = response.password;
				this.userid = response.id;
				this.appMenuModel.items[0].command = "logout";
				this.appMenuModel.items[0].label = "Logout " + this.username;
				this.mixCount = 7;
				this.controller.modelChanged(this.appMenuModel, this);
			}
		}
		if (!this.loaded) {
			this.showBanner("Just Type to Search...");
			this.loaded = true;
		}
		if (this.type != "followed") {
			f = this.fillList(this.tracks);
			this.controller.setWidgetModel("list1", f.getList());
			this.writeDescription();
		} else {
			var onComplete = function(transport) {
				if (transport.status === 200) {
					this.currentpage = 1;
					this.pagecount = Math.round(parseInt(transport.responseJSON.total_entries, 0) / 10);
					this.$.divider1.setLabel("Followed Users (" + this.currentpage + "/" + this.pagecount + ")"); //Latest Mixes ( 1/10)
					this.controller.get('scroller2').mojo.revealTop();
					this.cmdMenuModel.items[2].items[0].label = this.typelabel;
					this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
									this.cmdMenuModel.items[2].items[0].label = this.typelabel;
				//this.cmdMenuModel.items[2].items[0].command = this.type;
					this.controller.modelChanged(this.cmdMenuModel, this);
					f = this.fillUserList(transport.responseJSON.users);
					this.controller.setWidgetModel("list1", f.getList());
				}
				this.showSpinner(false);
			};
			var onFailure = function(transport) {
				this.popUp("Oops!", "Couldn't retreive page " + this.currentpage);
			};
			url = "http://8tracks.com/users/" + this.userid + "/follows_users.json";
			this.request(url, onComplete.bind(this), onFailure.bind(this));
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
		this.sCount = this.getNextMix(this.sCount + direction, this.mixCount);
		if (this.sCount < 1) {
			this.sCount = this.mixCount;
		} else if (this.sCount > this.mixCount) {
			this.sCount = 1;
		}
		switch (this.sCount) {
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
		}
		if (reload && this.type !== "followed") {
			var onComplete = function(transport) {
				this.currentpage = 1;
				this.controller.modelChanged(this.cmdMenuModel, this);
				this.tracks = transport.responseJSON.mixes;
				this.setid = transport.responseJSON.mix_set_id;
				this.pagecount = Math.ceil(parseInt(transport.responseJSON.total_entries, 0) / 10);
				this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
				this.cmdMenuModel.items[1].items[1].disabled = this.currentpage === this.pagecount;
				this.cmdMenuModel.items[2].items[0].label = this.typelabel;
				//this.cmdMenuModel.items[2].items[0].command = this.type;
				this.controller.modelChanged(this.cmdMenuModel,this);
				this.writeDescription();
				f = this.fillList(this.tracks, transport.responseJSON.mix_set_id);
				this.controller.setWidgetModel("list1", f.getList());
				this.showSpinner(false);
			};
			var onFailure = function(transport) {
				this.showSpinner(false);
				this.popUp("Oops!", "Couldn't retreive page " + this.currentpage);
			};
			var url = "";
			if (this.type === "liked") {
				url = "http://8tracks.com/users/" + this.userid + "/mixes.json?view=liked";
			} else if (this.type === "mine") {
				url = "http://8tracks.com/users/" + this.userid + "/mixes.json";
			} else {
				url = "http://8tracks.com/mixes.json?page=1&sort=" + this.type;
			}
			this.request(url, onComplete.bind(this), onFailure.bind(this));
		} else if (reload && this.type === "followed") {
			var onComplete = function(transport) {
				if (transport.status === 200) {
					this.currentpage = 1;
					this.pagecount = Math.ceil(parseInt(transport.responseJSON.total_entries, 0) / 10);
					this.$.divider1.setLabel("Followed Users (" + this.currentpage + "/" + this.pagecount + ")"); //Latest Mixes ( 1/10)
					this.controller.get('scroller2').mojo.revealTop();
					this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
					this.cmdMenuModel.items[1].items[1].disabled = this.currentpage === this.pagecount;
									this.cmdMenuModel.items[2].items[0].label = this.typelabel;
				//this.cmdMenuModel.items[2].items[0].command = this.type;
				this.controller.modelChanged(this.cmdMenuModel,this);
					f = this.fillUserList(transport.responseJSON.users);
					this.controller.setWidgetModel("list1", f.getList());
				}
				this.showSpinner(false);
			};
			var onFailure = function(transport) {
				this.popUp("Oops!", "Couldn't retreive page " + this.currentpage);
			};
			url = "http://8tracks.com/users/" + this.userid + "/follows_users.json";
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
		var reload = false;
		switch (event) {
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
		}
		if (reload && this.type !== "followed") {
			var onComplete = function(transport) {
				this.currentpage = 1;
				this.tracks = transport.responseJSON.mixes;
				this.setid = transport.responseJSON.mix_set_id;
				this.pagecount = Math.ceil(parseInt(transport.responseJSON.total_entries, 0) / 10);
				this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
				this.cmdMenuModel.items[1].items[1].disabled = this.currentpage === this.pagecount;
				this.cmdMenuModel.items[2].items[0].label = this.typelabel;
			//	this.cmdMenuModel.items[2].items[0].command = this.type;
				this.controller.modelChanged(this.cmdMenuModel, this);
				this.writeDescription();
				f = this.fillList(this.tracks, transport.responseJSON.mix_set_id);
				this.controller.setWidgetModel("list1", f.getList());
				this.showSpinner(false);
			};
			var onFailure = function(transport) {
				this.showSpinner(false);
				this.popUp("Oops!", "Couldn't retreive page " + this.currentpage);
			};
			var url = "";
			if (this.type === "liked") {
				url = "http://8tracks.com/users/" + this.userid + "/mixes.json?view=liked";
			} else if (this.type === "mine") {
				url = "http://8tracks.com/users/" + this.userid + "/mixes.json";
			} else {
				url = "http://8tracks.com/mixes.json?page=1&sort=" + this.type;
			}
			this.request(url, onComplete.bind(this), onFailure.bind(this));
		} else if (reload && this.type === "followed") {
			var onComplete = function(transport) {
				if (transport.status === 200) {
					this.currentpage = 1;
					this.pagecount = Math.ceil(parseInt(transport.responseJSON.total_entries, 0) / 10);
					this.$.divider1.setLabel("Followed Users (" + this.currentpage + "/" + this.pagecount + ")"); //Latest Mixes ( 1/10)
					this.controller.get('scroller2').mojo.revealTop();
					this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
					this.cmdMenuModel.items[1].items[1].disabled = this.currentpage === this.pagecount;
									this.cmdMenuModel.items[2].items[0].label = this.typelabel;
			//	this.cmdMenuModel.items[2].items[0].command = this.type;
					this.controller.modelChanged(this.cmdMenuModel, this);
					f = this.fillUserList(transport.responseJSON.users);
					this.controller.setWidgetModel("list1", f.getList());
				}
				this.showSpinner(false);
			};
			var onFailure = function(transport) {
				this.popUp("Oops!", "Couldn't retreive page " + this.currentpage);
			};
			url = "http://8tracks.com/users/" + this.userid + "/follows_users.json";
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
				url = "http://8tracks.com/users/" + this.userid + "/mixes.json?view=liked&page=" + this.currentpage;
			} else {
				url = "http://8tracks.com/mixes.json?page=" + this.currentpage + "&sort=" + this.type;
			}
			this.request(url, onComplete.bind(this), onFailure.bind(this));
		}
	},
	getNextPage: function() {
		this.currentpage += 1;
		var onComplete = function(transport) {
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
			url = "http://8tracks.com/users/" + this.userid + "/mixes.json?view=liked&page=" + this.currentpage;
		} else {
			url = "http://8tracks.com/mixes.json?page=" + this.currentpage + "&sort=" + this.type;
		}
		this.request(url, onComplete.bind(this), onFailure.bind(this));
	},
	list1Listtap: function(inSender, event) {
		if (event.item.type === "mix") {
			this.controller.stageController.pushScene('mixDetailsScene', event.item.mixInfo, event.item.set_id, this.userid, this.username, this.password);
		} else {
			this.controller.stageController.pushScene('userInfo', event.item.userinfo, this.userid, this.username, this.password);
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
			this.cookie = new Mojo.Model.Cookie("credentials");
			this.cookie.put({
				username: "",
				password: "",
				token: 0
			});
			this.loggedin = false;
			this.username = "";
			this.password = "";
			this.userid = -1;
			this.mixCount = 4;
			this.appMenuModel.items[0].command = "login";
			this.appMenuModel.items[0].label = "Login";
			this.controller.modelChanged(this.appMenuModel, this);
			break;
		case 'support':
			this.controller.serviceRequest("palm://com.palm.applicationManager", {
				method: 'open',
				parameters: {
					id: "com.palm.app.email",
					params: {
						summary: "8tracks Support Request: v1.2.9",
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
				}]
			});
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