function themeLookup(color) {
		switch (color) {
		case 'dark':
			ret = {
				URL: "url(images/greydiant.jpg)",
				textColor: "white"
			};
			return ret;
			break;
		case 'lite':
			ret = {
				URL: "url(images/white-1.jpg)",
				textColor: "white"
			};
			return ret;
			break;
		case 'lite2':
			ret = {
				URL: "url(images/white-1.jpg)",
				textColor: "black"
			};
			return ret;
			break;
		case 'red':
			ret = {
				URL: "url(images/red.png)",
				textColor: "white"
			};
			return ret;
			break;
		case 'blue':
			ret = {
				URL: "url(images/blue.jpg)",
				textColor: "black"
			};
			return ret;
			break;
		case 'flat':
			ret = {
				URL: "url(images/pure.jpg)",
				textColor: "black"
			};
			return ret;
			break;
		default:
			ret = {
				URL: "url(images/white-1.jpg)",
				textColor: "white"
			};
			return ret;
			break;
		}
	};