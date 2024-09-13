// Thunderbird can terminate idle backgrounds in Manifest V3.
// Any listener directly added during add-on startup in the top level scope will
// be registered as a persistent listener and the background will wake up (restart)
// each time the event is fired. Listeners have to be registered before the first
// occurrence of an await keyword.

// React on any new message being displayed.
browser.messageDisplay.onMessagesDisplayed.addListener(removeAttachmentsIfJunk);

async function removeAttachmentsIfJunk(tab, messageList) {
  // We only want the first one.
  const { messages } = messageList;
  if (!messages) {
    return;
  }

  // Only remove attachments, if the displayed message is junk.
  if (messages.length != 1 || !messages[0].junk) {
    return;
  }

  // browser.MessageDisplayAttachment.removeAttachments is an Experiment API,
  // which operates on the given tab and removes all displayed attachments.
  await browser.MessageDisplayAttachment.removeAttachments(tab.id);
}

// In Manifest V3, the background script is executed when the extension is
// resuming after being terminated. In this case we do not want to retrigger our
// overlay code. We use the session storage, which is cleared every time the
// add-on is shut down normally, but not when terminated.
let { startup } = await browser.storage.session.get({ startup: true });
if (startup) {
  await browser.storage.session.set({ startup: false });

  // Handle all already open/displayed messages.
  let tabs = await browser.tabs.query({ type: ["messageDisplay", "mail"] })
  for (let tab of tabs) {
    const messageList = await browser.messageDisplay.getDisplayedMessages(tab.id);
    await removeAttachmentsIfJunk(tab, messageList);
  }
}


