var MessageDisplayAttachment = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {

    // Get the native about:message window from the tabId.
    function getMessageWindow(tabId) {
      let { nativeTab } = context.extension.tabManager.get(tabId);
      if (nativeTab instanceof Ci.nsIDOMWindow) {
        return nativeTab.messageBrowser.contentWindow
      } else if (nativeTab.mode && nativeTab.mode.name == "mail3PaneTab") {
        return nativeTab.chromeBrowser.contentWindow.messageBrowser.contentWindow
      } else if (nativeTab.mode && nativeTab.mode.name == "mailMessageTab") {
        return nativeTab.chromeBrowser.contentWindow;
      }
      return null;
    }

    return {
      MessageDisplayAttachment: {
        removeAttachments: async function (tabId) {
          let window = getMessageWindow(tabId);
          if (!window) {
            return;
          }

          // The following code depends in internal Thunderbird methods and may
          // change, which will break the add-on.
          for (let index = window.currentAttachments.length; index > 0; index--) {
            let idx = index - 1;
            window.currentAttachments.splice(idx);
          }

          await window.ClearAttachmentList();
          window.gBuildAttachmentsForCurrentMsg = false;
          await window.displayAttachmentsForExpandedView();
          window.gBuildAttachmentsForCurrentMsg = true;
        },
      },
    };
  }
};
