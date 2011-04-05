/* Copyright 2009 Palm, Inc.  All rights reserved. */

/*globals Mojo, clearInterval, AppAssistant, MojoLoader, Audio, MediaKeyControlHandler, StatusBroadcaster, Playlist, HTMLMediaElement, setInterval*/

function DashboardPlayer() {
	var _audioObj = 0; // initialized to 0
	var _photo = 0; // initialized to 0
	var _song = 0; // initialized to 0
	var _skipTrack = 0;
	var _loaded = false;
	var _likeToggle = false;
	var _liked = false;
	
	this.singletonInstance = null;

	// Get the instance of the Cats class
	// If there’s none, instanciate one
	var getInstance = function() {
		if (!this.singletonInstance) {
			this.singletonInstance = createInstance();
		}
		return this.singletonInstance;
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
			}
		};
	};

	return getInstance();
}

DashPlayerInstance = 0;