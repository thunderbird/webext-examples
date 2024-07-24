var restart = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      restart: {
        execute() {
          Services.startup.quit(
            Services.startup.eForceQuit | Services.startup.eRestart
          );
        },
      },
    }
  }
}
