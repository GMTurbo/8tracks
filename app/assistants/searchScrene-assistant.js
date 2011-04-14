function SearchScreneAssistant(argFromPusher, userid, criteria) {
	this.criteria = "All";
	this.searchCriteria = "q";
	if (typeof criteria !== "undefined") {
		this.criteria = criteria;
		switch (criteria) {
		case "Genre":
			this.searchCriteria = "tag";
			break;
		case "Creator":
			this.searchCriteria = "user";
			break;
		}
	}
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
	if (typeof argFromPusher !== 0 && argFromPusher.toString().length === 2) {
		this.character = Mojo.Char.isValidWrittenChar(argFromPusher);
	} else if (argFromPusher.length > 2) {
		this.character = argFromPusher;
	} else {
		this.character = "";
	}
	this.userid = -1;
	this.searchCriteria = "q";
	cookie = new Mojo.Model.Cookie("credentials");
	if (cookie.get()) {
		this.userid = typeof userid === "undefined" ? -1 : userid;
		this.username = cookie.get().username;
		this.password = cookie.get().password;
	}
	this.tracks = "";
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
				timeSince: new Date(tracks[i].first_published_at).toRelativeTime() === "NaN years ago" ? "by " + tracks[i].user.login : new Date(tracks[i].first_published_at).toRelativeTime() + " by " + tracks[i].user.login
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
	this.currentpage = 1;
	this.pagecount = 1;
	this.writeDescription = function() {
		this.$.divider2.setLabel("page: " + this.currentpage + "/" + this.pagecount);
		this.controller.get('scroller1').mojo.revealTop();
	};
}

SearchScreneAssistant.prototype = {
	setup: function() {
		this.cmdMenuModel = {
			visible: true,
			items: [
				{},
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
					disabled: this.pagecount === this.currentpage
				}]
			},
				{}
				]
		};
		this.controller.setupWidget(Mojo.Menu.commandMenu, {
			spacerHeight: 0,
			menuClass: 'no-fade'
		},
		this.cmdMenuModel);
		this.controller.document.addEventListener("keyup", this.keyupHandler.bind(this), true);
		Ares.setupSceneAssistant(this);
	},
	cleanup: function() {
		this.controller.document.removeEventListener("keyup", this.keyupHandler.bind(this), true);
		Ares.cleanupSceneAssistant(this);
	},
	activate: function(data) {
		this.cookie2 = new Mojo.Model.Cookie("prefs");
		if (this.cookie2.get()) {
			props = themeLookup(this.cookie2.get().theme);
			this.controller.get('searchScrene').style.backgroundImage = props.URL;
			this.$.list1.style.addStyles({
				textColor: props.textColor
			});
		}
		this.controller.get('textField3').mojo.focus();
		this.controller.get('textField3').mojo.setValue(this.character);
		this.$.listSelector1.setValue(this.criteria);
		this.showSpinner(false);
		if (this.character !== "" && typeof data === "undefined") {
			this.search();
		}
	},
	showSpinner: function(show) {
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

	search: function() {
		var onComplete = function(transport) {
			this.currentpage = 1;
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
			this.showSpinner(false);
			//this.popUp("Oops!", "Search Error");
		};
		this.character = this.controller.get('textField3').mojo.getValue();
		var url = "";
		if (this.searchCriteria !== "user") {
			url = "http://8tracks.com/mixes.json?" + this.searchCriteria + "=" + this.controller.get('textField3').mojo.getValue() + "&page=" + this.currentpage;
		} else {
			url = "http://8tracks.com/users/" + this.controller.get('textField3').mojo.getValue().toString().toLowerCase() + "/mixes.json?page=" + this.currentpage;
		}
		this.request(url, onComplete.bind(this), onFailure.bind(this));
	},

	keyupHandler: function(event) {
		if (event.keyCode !== 27) {
			this.search();
		}
	},

	list1Listtap: function(inSender, event) {
		this.controller.stageController.pushScene('mixDetailsScene', event.item.mixInfo, event.item.set_id, this.userid, this.username, this.password);
	},
	getNextPage: function() {
		this.currentpage += 1;
		var onComplete = function(transport) {
			this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
			this.cmdMenuModel.items[1].items[1].disabled = this.currentpage === this.pagecount;
			this.controller.modelChanged(this.cmdMenuModel, this);
			this.tracks = transport.responseJSON.mixes;
			f = this.fillList(this.tracks);
			this.controller.setWidgetModel("list1", f.getList());
			this.writeDescription();
			this.showSpinner(false);
		};
		var onFailure = function(transport) {
			this.showSpinner(false);
			this.popUp("Oops!", "Couldn't retreive page " + this.currentpage);
		};
		if (this.searchCriteria !== "user") {
			url = "http://8tracks.com/mixes.json?" + this.searchCriteria + "=" + this.controller.get('textField3').mojo.getValue() + "&page=" + this.currentpage;
		} else {
			url = "http://8tracks.com/users/" + this.controller.get('textField3').mojo.getValue() + "/mixes.xml?view=mix_feed&page=" + this.currentpage;
		}
		this.request(url, onComplete.bind(this), onFailure.bind(this));
	},
	getPreviousPage: function() {
		if (this.currentpage - 1 > 0) {
			this.currentpage -= 1;
			var onComplete = function(transport) {
				this.cmdMenuModel.items[1].items[0].disabled = this.currentpage === 1;
				this.cmdMenuModel.items[1].items[1].disabled = this.currentpage === this.pagecount;
				this.controller.modelChanged(this.cmdMenuModel, this);
				this.tracks = transport.responseJSON.mixes;
				f = this.fillList(this.tracks);
				this.controller.setWidgetModel("list1", f.getList());
				this.writeDescription();
				this.showSpinner(false);
			};
			var onFailure = function(transport) {
				this.showSpinner(false);
				this.popUp("Oops!", "Couldn't retreive page " + this.currentpage);
			};
			var url = "";
			if (this.searchCriteria !== "user") {
				url = "http://8tracks.com/mixes.json?" + this.searchCriteria + "=" + this.controller.get('textField3').mojo.getValue() + "&page=" + this.currentpage;
			} else {
				url = "http://8tracks.com/users/" + this.controller.get('textField3').mojo.getValue() + "/mixes.xml?view=mix_feed&page=" + this.currentpage;
			}
			this.request(url, onComplete.bind(this), onFailure.bind(this));
		}
	},
	listSelector1Change: function(inSender, event) {
		this.searchCriteria = event.value;
		this.search();
	}
};

SearchScreneAssistant.prototype.handleCommand = function(event) {
	this.controller = Mojo.Controller.stageController.activeScene();
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
		case 'fwd':
			this.getNextPage().bind(this);
			break;
		case 'back':
			this.getPreviousPage().bind(this);
			break;
		}
	}
};