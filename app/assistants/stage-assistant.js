function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
	this.controller.pushScene({name: "splash", disableSceneScroller: true});
	this.controller.setWindowOrientation("up");
};