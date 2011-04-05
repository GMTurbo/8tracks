function AppAssistant() {}

AppAssistant.prototype.setup = function() {
	this.loadFirstSceneHandler = this.loadFirstScene.bind(this);
	this.loadDashboardHandler = this.loadDashboard.bind(this);
	window.document.addEventListener(Mojo.Event.stageDeactivate, this.onDeactivateHandler.bind(this));
	window.document.addEventListener(Mojo.Event.stageActivate, this.onActivateHandler.bind(this));
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
		stageController.pushScene('dashboard', DashPlayerInstance);
	};