//timeSince.js by David Strack
//written for webOS application Digloo and modified for Zipsquare
//a collection of functions useful to me in regards to relative time

function timeSince(time, unix){
	//takes a JS or UNIX timestamp and figures out how long ago it was compared to current time
	var diff = new Date();
	var now = new Date();
	var then = new Date(time);
	if (unix){
		then.setTime(time * 1000); //unix timestamp support	
	}		
	diff.setTime(Math.abs(now.getTime() - then.getTime()));
	var timediff = diff.getTime();
	
	years = Math.floor(timediff / (1000 * 60 * 60 * 24 * 365));
	months = Math.floor(timediff / (1000 * 60 * 60 * 24 * 31));
	days = Math.floor(timediff / (1000 * 60 * 60 * 24)); 
	hours = Math.floor(timediff / (1000 * 60 * 60)); 
	mins = Math.floor(timediff / (1000 * 60)); 
	secs = Math.floor(timediff / 1000);
	if(then.getTime().toString() == "NaN"){
		return new Date(time).toRelativeTime();
	}
	if (years != 0){
		if (years == 1){
			return '1 year ago';
		}
		else{
			return years + ' years ago';
		}
	}
	else if(months != 0){
		if (months == 1){
			return '1 month ago';
		}
		else{
			return months + ' months ago';
		}
	}
	else if(days != 0){
		if (days == 1){
			return '1 day ago';
		}
		else{
			return days + ' days ago';
		}		
	}
	else if(hours != 0){
		if (hours == 1){
			return '1 hour ago';
		}
		else{
			return hours + ' hours ago';
		}
	}
	else if(mins != 0){
		return mins + ' min ago';
	}
	else if(secs != 0){
		return secs + ' sec ago';
	}
}
function isToday(time){
	var diff = new Date();
	var now = new Date();
	var then = new Date(time);

	diff.setTime(Math.abs(now.getTime() - then.getTime()));
	var timediff = diff.getTime();
	
	var hours = Math.floor(timediff / (1000 * 60 * 60)); 
	if (hours < 24){
		return true;
	}else{
		return false;
	}
}

function secondsSince(time){
	var diff = new Date();
	var now = new Date();
	var then = new Date(time);
	diff.setTime(Math.abs(now.getTime() - then.getTime()));
	var timediff = diff.getTime();
	return Math.floor(timediff / 1000) + 0;	
}

function sortDate(a, b){
	return parseInt(a.secs) - parseInt(b.secs);
}

/**
* Returns a description of this past date in relative terms.
* Takes an optional parameter (default: 0) setting the threshold in ms which
* is considered "Just now".
*
* Examples, where new Date().toString() == "Mon Nov 23 2009 17:36:51 GMT-0500 (EST)":
*
* new Date().toRelativeTime()
* --> 'Just now'
*
* new Date("Nov 21, 2009").toRelativeTime()
* --> '2 days ago'
*
* // One second ago
* new Date("Nov 23 2009 17:36:50 GMT-0500 (EST)").toRelativeTime()
* --> '1 second ago'
*
* // One second ago, now setting a now_threshold to 5 seconds
* new Date("Nov 23 2009 17:36:50 GMT-0500 (EST)").toRelativeTime(5000)
* --> 'Just now'
*
*/
Date.prototype.toRelativeTime = function(now_threshold) {
  var delta = new Date() - this;

  now_threshold = parseInt(now_threshold, 10);

  if (isNaN(now_threshold)) {
    now_threshold = 0;
  }

  if (delta <= now_threshold) {
    return 'Just now';
  }

  var units = null;
  var conversions = {
    millisecond: 1, // ms -> ms
    second: 1000, // ms -> sec
    minute: 60, // sec -> min
    hour: 60, // min -> hour
    day: 24, // hour -> day
    month: 30, // day -> month (roughly)
    year: 12 // month -> year
  };

  for (var key in conversions) {
    if (delta < conversions[key]) {
      break;
    } else {
      units = key; // keeps track of the selected key over the iteration
      delta = delta / conversions[key];
    }
  }

  // pluralize a unit when the difference is greater than 1.
  delta = Math.floor(delta);
  if (delta !== 1) { units += "s"; }
  return [delta, units, "ago"].join(" ");
};

/*
* Wraps up a common pattern used with this plugin whereby you take a String
* representation of a Date, and want back a date object.
*/
Date.fromString = function(str) {
  return new Date(Date.parse(str));
};
