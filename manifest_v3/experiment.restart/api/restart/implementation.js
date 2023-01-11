// Import some things we need.
var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

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
