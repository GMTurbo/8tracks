function MainAssistant() {
}

MainAssistant.prototype.cleanup = function() {
    // launch the dashboard when the main card scene is discarded
    Mojo.Controller.getAppController().assistant.handleLaunch({action: 'dashboard'});
    MainAssistant.prototype.cleanup = function() {}; // changing the cleanup method so that it doesn't launch a dashboard the second time
}
