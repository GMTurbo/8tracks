function AppAssistant() {}

var flag = false;

AppAssistant.prototype.setup = function() {
	this.loadFirstSceneHandler = this.loadFirstScene.bind(this);
	this.loadDashboardHandler = this.loadDashboard.bind(this);
	window.document.addEventListener(Mojo.Event.stageDeactivate, this.onDeactivateHandler.bind(this));
	window.document.addEventListener(Mojo.Event.stageActivate, this.onActivateHandler.bind(this));
};

AppAssistant.prototype.cleanup = function() {
	window.document.removeEventListener(Mojo.Event.stageDeactivate, this.onDeactivateHandler.bind(this));
	window.document.removeEventListener(Mojo.Event.stageActivate, this.onActivateHandler.bind(this));
};

AppAssistant.prototype.onDeactivateHandler = function(event) {
	var dashboardController = this.controller.getStageController('dashboard');
	if (!dashboardController) {
		this.controller.createStageWithCallback({
			name: 'dashboard',
			lightweight: true,
			clickableWhenLocked: true
		},
		this.loadDashboardHandler, 'dashboard');
	}
};

AppAssistant.prototype.onActivateHandler = function(event) {
	var dashboardController = this.controller.getStageController('dashboard');
	if (dashboardController) {
		this.appController = Mojo.Controller.getAppController();
		this.appController.closeStage('dashboard');
	}
};

AppAssistant.prototype.loadFirstScene = function(stageController) {
	stageController.pushScene('gridScene');
};

AppAssistant.prototype.loadDashboard = function(stageController) {
	if (DashPlayerInstance !== 0) {
		if (DashPlayerInstance.audio() !== 0) {
			stageController.pushScene('dashboard', DashPlayerInstance);
		} else {
			Mojo.Controller.getAppController().closeStage('dashboard');
		}
	} else {
		Mojo.Controller.getAppController().closeStage('dashboard');
	}
};

AppAssistant.prototype.handleLaunch = function(launchParams) {
	if (launchParams.query) {
		justTypeInstance = new justType();
		justTypeInstance.setup("query", launchParams.query.split("%20"));
	} else if (launchParams.Play) {
		justTypeInstance = new justType();
		justTypeInstance.setup("play", launchParams.Play.split("%20"));
	} else if (launchParams.focus) {
		Mojo.Controller.stageController.activate();
	}
};

AppAssistant.prototype.onFocusHandler = function() {
	this.lostFocus = false;
};

AppAssistant.prototype.onBlurHandler = function() {
	this.lostFocus = true;
};