import { parse5322 } from './modules/email-addresses.js';

await browser.scripting.compose.registerScripts([{
  id: "compose-script-example-1",
  js: ["compose.js"]
}]);

/**
 * Handles commands received from the compose script, to send make the
 * ComposeDetails available to the compose script.
 */
async function doHandleCommand (message, sender) {
  const { command } = message;
  const { tab: { id: tabId } } = sender;
  switch(command) {
    case "getToAddress":
      let details = await browser.compose.getComposeDetails(tabId);
      let rv;
      try {
        rv = details.to.map(parse5322.parseOneAddress);
      } catch (e) {
        console.error(e);
      }
      return rv;
      break;
  }
}

/**
 * Handles the received commands by filtering all messages where "type" property
 * is set to "command". Ignore all other requests.
 */
browser.runtime.onMessage.addListener((message, sender) => {
  if (message && message.hasOwnProperty("command")) {
    return doHandleCommand(message, sender);
  }
});
