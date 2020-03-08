// Import some things we need.
var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { ExtensionSupport } = ChromeUtils.import("resource:///modules/ExtensionSupport.jsm");
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

var restart = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    context.callOnClose(this);
    return {
      restart: {
        init() {
          // Listen for the main Thunderbird windows opening.
          ExtensionSupport.registerWindowListener("restartListener", {
            // Before Thunderbird 74, messenger.xhtml was messenger.xul.
            chromeURLs: [
              "chrome://messenger/content/messenger.xhtml",
              "chrome://messenger/content/messenger.xul",
            ],
            onLoadWindow(window) {
              // Add a menu item to the File menu of any main window.
              let fileQuitItem = window.document.getElementById("menu_FileQuitItem");
              if (fileQuitItem) {
                let fileRestartItem = window.document.createXULElement("menuitem");
                fileRestartItem.id = "menu_FileRestartItem";
                fileRestartItem.setAttribute("label", "Restart");
                fileRestartItem.setAttribute("accesskey", "R");
                fileRestartItem.addEventListener("command", () => Services.startup.quit(
                  Services.startup.eForceQuit | Services.startup.eRestart
                ));
                fileQuitItem.parentNode.insertBefore(fileRestartItem, fileQuitItem);
              }
            },
          });
        },
      },
    };
  }

  close() {
    // Clean up any existing windows that have the menu item.
    for (let window of Services.wm.getEnumerator("mail:3pane")) {
      let fileRestartItem = window.document.getElementById("menu_FileRestartItem");
      if (fileRestartItem) {
        fileRestartItem.remove();
      }
    }
    // Stop listening for new windows.
    ExtensionSupport.unregisterWindowListener("restartListener");
  }
};
