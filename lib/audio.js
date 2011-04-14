
function DashboardPlayer() {
	var _audioObj = 0; // initialized to 0
	var _photo = 0; // initialized to 0
	var _song = 0; // initialized to 0
	var _skipTrack = 0;
	var _loaded = false;
	var _likeToggle = false;
	var _liked = false;
	var _loggedin = false;
	
	this.singletonDashInstance = null;

	// Get the instance of the Cats class
	// If there’s none, instanciate one
	var getInstance = function() {
		if (!this.singletonDashInstance) {
			this.singletonDashInstance = createInstance();
		}
		return this.singletonDashInstance;
	};

	// Create an instance of the Cats class
	var createInstance = function() {
		// Here, you return all public methods and variables
		return {
			update: function(audio, pht, info) {
				_audioObj = audio;
				_photo = pht;
				_song = {
					name: info.set.track.name,
					artist: info.set.track.performer
				};
				_liked = info.set.track.faved_by_current_user;
				_loaded = true;
				_isPlaying = true;
			},
			setSkipEvent: function(skipFunc){
				_skipTrack = skipFunc;
			},
			setLikeToggleEvent: function(toggleLike){
				_likeToggle = toggleLike;
			},
			setLogin: function(val){
				_loggedin = val;
			},
			song: function() {
				return _song;
			},
			photo: function() {
				return _photo;
			},
			audio: function() {
				return _audioObj;
			},
			loaded: function() {
				return _loaded;
			},
			isPlaying: function(){
				return !_audioObj.paused;
			},
			liked: function(state){
				return _liked;
			},
			toggleLike: function(state){
				_liked = state;
				_likeToggle(state);
			},
			skipTrack: function(){
					_skipTrack();
			},
			loggedIn: function(){
					return _loggedin;
			},
			cleanup: function(){
				_audioObj.pause();
				_audioObj = 0;
				_photo = 0;
				_song = 0
				_liked = false;
				_loaded = false;
				_isPlaying = false;
			}
		};
	};

	return getInstance();
}

DashPlayerInstance = 0;