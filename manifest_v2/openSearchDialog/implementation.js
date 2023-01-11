var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

var myapi = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      myapi: {
        async openSearchDialog() {
          let recentWindow = Services.wm.getMostRecentWindow("mail:3pane");
          if (recentWindow) {
            recentWindow.MsgSearchMessages();
          }
        },
      },
    };
  }
};
