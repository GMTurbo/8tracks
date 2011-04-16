
VERSION = "1.4.8";

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
				URL: "url(images/white-1.jpg)",
				textColor: "white"
			};
			return ret;
		}
	}
