var searchDialog = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      searchDialog: {
        async open() {
          let recentWindow = Services.wm.getMostRecentWindow("mail:3pane");
          if (recentWindow) {
            recentWindow.goDoCommand("cmd_searchMessages");
          }
        },
      },
    };
  }
};
