## Remove Attachments If Junk Experiment

This extension uses an Experiment to remove attachments from the message display area, if the message is classified as junk.

In order to manipulate the message display area of already open messages and all messages which are opened in the future, the example uses the WebExtension `tabs` and `messageDisplay` APIs.

### Differences from the version for Manifest V2

One of the two used event listeners was originally defined AFTER the first occurrence of an async `await`, which causes this listener to not be registered as a persistent listener. It had to be moved before the first async `await`.

The background script is executed every time the extension is resumed by a persistent listener. This causes the code which overlays all open message tabs to be re-run. The mitigation implemented here uses a flag in the session storage (it is only cleared on normal add-on shut down, but not when terminated):

```
let { startup } = await browser.storage.session.get({ startup: true });
if (startup) {
  await browser.storage.session.set({ startup: false });

  // Handle all already open/displayed messages.
  let tabs = await browser.tabs.query({ type: ["messageDisplay", "mail"] })
  for (let tab of tabs) {
    const { messages } = await browser.messageDisplay.getDisplayedMessages(tab.id);
    const [message] = messages;
    if (message) {
      await removeAttachmentsIfJunk(tab, message);
    }
  }
}
```



Furthermore, in Manifest V3 the function `browser.messageDisplay.getDisplayedMessage()` has to be replaced by `browser.messageDisplay.getDisplayedMessages()`, and the event `browser.messageDisplay.onMessageDisplayed` has to be replaced by `browser.messageDisplay.onMessagesDisplayed`.