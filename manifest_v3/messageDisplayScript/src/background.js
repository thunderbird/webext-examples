// Thunderbird can terminate idle backgrounds in Manifest V3.
// Any listener directly added during add-on startup will be registered as a
// persistent listener and the background will wake up (restart) each time the
// event is fired. 

browser.scripting.messageDisplay.registerScripts([{
  id: "message-display-script-example-1",
  css: ["/src/message-content-styles.css"],
  js: ["/src/message-content-script.js"],
}]);

/**
 * command handler: handles the commands received from the content script
 */
const doHandleCommand = async (message, sender) => {
  const { command } = message;
  const {
    tab: { id: tabId },
  } = sender;

  const messageHeader = await browser.messageDisplay.getDisplayedMessage(tabId);

  // Check for known commands.
  switch (command.toLocaleLowerCase()) {
    case "getnotificationdetails":
      {
        // Create the information chunk we want to return to our message content
        // script.
        return {
          text: `Mail subject is "${messageHeader.subject}"`,
        };
      }
      break;

    case "markunread":
      {
        // Get the current message from the given tab.
        if (messageHeader) {
          // Mark the message as unread.
          browser.messages.update(messageHeader.id, {
            read: false,
          });
        }
      }
      break;
  }
};

/**
 * Add a handler for communication with other parts of the extension,
 * like our messageDisplayScript.
 *
 * 👉 There should be only one handler in the background script
 *    for all incoming messages
 *    
 * 👉 Handle the received message by filtering for a distinct property and select
 *    the appropriate handler
 */
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.hasOwnProperty("command")) {
    // If we have a command, return a promise from the command handler.
    return doHandleCommand(message, sender);
  }
  return false;
});
