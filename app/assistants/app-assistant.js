function AppAssistant() {}

AppAssistant.prototype.setup = function() {
	this.loadFirstSceneHandler = this.loadFirstScene.bind(this);
	this.loadDashboardHandler = this.loadDashboard.bind(this);
	this.loadPlayerHandler = this.loadPlayer.bind(this);
};

AppAssistant.prototype.cleanup = function() {};

AppAssistant.prototype.onDeactivateHandler = function(event) {
	if (DashPlayerInstance !== 0) {
		if (DashPlayerInstance.audio() !== 0) {
			var dashboardController = this.controller.getStageController("dashboard");
			if (!dashboardController) {
				this.controller.createStageWithCallback({
					name: "dashboard",
					lightweight: true,
					clickableWhenLocked: true
				},
				this.loadDashboardHandler, 'dashboard');
			}
		}
	}
};

AppAssistant.prototype.onActivateHandler = function(event) {
	var dashboardController = this.controller.getStageController("dashboard");
	if (dashboardController) {
		this.appController = Mojo.Controller.getAppController();
		this.appController.closeStage("dashboard");
	}
};

AppAssistant.prototype.loadFirstScene = function(stageController) {
	stageController.pushScene("gridScene");
};

AppAssistant.prototype.loadDashboard = function(stageController) {
	stageController.pushScene("dashboard", DashPlayerInstance);
};
AppAssistant.prototype.loadPlayer = function(stageController) {
	params = this.params;
	stageController.pushScene("player", params.mixInfo, params.token, params.response, params.cover, params.setid, params.userid, params.username, params.password, params.liked);

};

AppAssistant.prototype.handleLaunch = function(launchParams) {
	if (launchParams.query) {
		justTypeInstance = new justType();
		justTypeInstance.setup("query", launchParams.query.split("%20"));
	} else if (launchParams.Play) {
		justTypeInstance = new justType();
		justTypeInstance.setup("play", launchParams.Play.split("%20"));
	} else if (launchParams.focus) {
		playerController = this.controller.getStageController("player");
		if (playerController) {
			playerController.activate();
		}
	} else if (typeof launchParams.launchScene !== "undefined") {
		if (launchParams.launchScene === 'player') {
			playerController = this.controller.getStageController("player");
			if (playerController) {
				this.appController = Mojo.Controller.getAppController();
				this.appController.closeStage("player");
			}
			dashController = this.controller.getStageController("dashboard");
			if (dashController) {
				this.appController = Mojo.Controller.getAppController();
				this.appController.closeStage("dashboard");
			}

			this.params = launchParams;
			this.controller.createStageWithCallback({
				name: "player"
			},
			this.loadPlayerHandler, 'card');
		}
	}
};


AppAssistant.prototype.onFocusHandler = function() {
	this.lostFocus = false;
};

AppAssistant.prototype.onBlurHandler = function() {
	this.lostFocus = true;
};