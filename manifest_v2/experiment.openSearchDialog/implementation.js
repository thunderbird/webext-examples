var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

var searchDialog = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      searchDialog: {
        async open() {
          let recentWindow = Services.wm.getMostRecentWindow("mail:3pane");
          if (recentWindow) {
            recentWindow.MsgSearchMessages();
          }
        },
      },
    };
  }
};
