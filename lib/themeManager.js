function request(url, onComplete, onFailure) {
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
}

function post(url, postdata, onComplete, onFailure, postbody) {
	if(typeof postbody==="undefined"){
	var myAjax = new Ajax.Request(url, {
		method: "post",
		requestHeader: postdata,
		onComplete: onComplete,
		onFailure: onFailure
	});
	}else{
	var myAjax = new Ajax.Request(url, {
		method: "post",
		requestHeader: postdata,
		postBody: postbody,
		onComplete: onComplete,
		onFailure: onFailure
	});
	}
}

function themeLookup(color) {
		switch (color) {
		case 'dark':
			ret = {
				URL: "url(images/greydiant.jpg)",
				textColor: "white"
			};
			return ret;
		case 'lite':
			ret = {
				URL: "url(images/white-1.jpg)",
				textColor: "#4A4344" // grey36
			};
			return ret;
		case 'lite2':
			ret = {
				URL: "url(images/white-1.jpg)",
				textColor: "black"
			};
			return ret;
		case 'red':
			ret = {
				URL: "url(images/red.png)",
				textColor: "white"
			};
			return ret;
		case 'blue':
			ret = {
				URL: "url(images/blue.jpg)",
				textColor: "black"
			};
			return ret;
		case 'flat':
			ret = {
				URL: "url(images/pure.jpg)",
				textColor: "black"
			};
			return ret;
		default:
			ret = {
				URL: "url(images/pure.jpg)",
				textColor: "black"
			};
			return ret;
		}
	}
function loginTo8tracks(username, password, onComplete, onFailure) {
	url = "http://8tracks.com/sessions.json";
	var postdata = "login=" + username + "&password=" + password;

	var myAjax = new Ajax.Request(url, {
		method: "post",
		parameters: postdata,
		onComplete: onComplete,
		onFailure: onFailure
	});
}

function checkForCredentials() {
	cookie = new Mojo.Model.Cookie("credentials");
	login = "";
	pw = "";
	id = -1;
	avatar = null;
	uf = false;
	pf = false;
	idf = false;
	if (cookie.get()) {
		if (typeof cookie.get().username !== "undefined") {
			login = cookie.get().username;
			uf = true;
		}
		if (typeof cookie.get().password !== "undefined") {
			pw = cookie.get().password;
			pf = true;
		}
		if (typeof cookie.get().userid !== "undefined") {
			id = cookie.get().userid;
			idf = true;
		}
		if (typeof cookie.get().avatar !== "undefined") {
			avatar = cookie.get().avatar;
		}
	}
	return {
		loggedin: uf & pf & idf,
		username: login,
		password: pw,
		userid: id,
		avatar: avatar
	};
}

function logout() {
	cookie = new Mojo.Model.Cookie("credentials");
	cookie.put({
		username: undefined,
		password: undefined,
		userid: undefined,
		avatar: undefined,
		loggedin: false
	});
}