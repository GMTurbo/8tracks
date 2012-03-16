
var API_KEY = "api_key=7332430d6e1f0d60f307172446a4a1b71f6e1221";

function sendURL(url, format){
	if(typeof format !== "undefined"){
		url += "?format=json";
	}
	return url + "&" + API_KEY;
};

function mixLookup(check) {
	switch (check.toLowerCase()) {
	case "latest":
		return true;
	case "popular":
		return true;
	case "hot":
		return true;
	case "random":
		return true;
	case "liked":
		return true;
	case "my mixes":
		return true;
	case "following":
		return true;
	case "featured":
		return true;
	default:
		return false;
	}
}
function mixKey(check) {
	switch (check.toLowerCase()) {
	case "latest":
		return "l_mixes";
	case "popular":
		return "p_mixes";
	case "hot":
		return "h_mixes";
	case "random":
		return "r_mixes";
	case "liked":
		return "liked";
	case "my mixes":
		return "mine";
	case "following":
		return "followed";
	case "followed":
		return "followed";
	case "featured":
		return "featured";
	default:
		return "";
	}
}

function justType() {
	var _reqType = null; // initialized to null
	var _criteria = null;

	this.singleJTtonInstance = null;

	// Get the instance of the justType class
	// If there’s none, instanciate one
	var getInstance = function() {
		if (!this.singleJTtonInstance) {
			this.singleJTtonInstance = createInstance();
		}
		return this.singleJTtonInstance;
	};

	// Create an instance of the justType class
	var createInstance = function() {
		// Here, you return all public methods and variables
		return {
			setup: function(type, criteria) {
				_reqType = type;
				if (criteria.length > 2) {
					shift = function(mixname, offset, array) {
						tmp = [];
						tmp[0] = mixname;
						for (i = offset; i < array.length; i++) {
							tmp.push(array[i]);
						}
						if (tmp.length > 2) {
							str = "";
							for (i = 1; i < tmp.length; i++) {
								if (i !== tmp.length - 1) {
									str += tmp[i] + " ";
								} else {
									str += tmp[i];
								}
							}
							tmp2 = [];
							tmp2[0] = tmp[0];
							tmp2[1] = str;
							tmp = tmp2;
						}
						return tmp;
					};
					if (criteria[0].toLowerCase() + " " + criteria[1].toLowerCase() === "my mixes") {
						criteria = shift("my mixes", 2, criteria);
					}
					criteria = shift(criteria[0], 1, criteria);
				}
				// check if the first word is a mixtype
				if (mixLookup(criteria[0])) {
					_criteria = {
						mixType: criteria[0],
						searchTerm: criteria.length > 1 ? criteria[1] : "first"
					};
				} else { //it's not so just search for that
					_criteria = {
						mixType: criteria.join(" "),
						searchTerm: "first"
					};
				}
			},
			type: function() {
				return _reqType;
			},
			criteria: function() {
				return _criteria;
			}
		};
	};
	return getInstance();
}

justTypeInstance = 0;