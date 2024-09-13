// Handle all already open/displayed messages.
let tabs = await browser.tabs.query({ type: ["messageDisplay", "mail"] })
for (let tab of tabs) {
  let message = await browser.messageDisplay.getDisplayedMessage(tab.id);
  if (message) {
    await handleMessage(tab, message);
  }
}

// React on any new message being displayed.
browser.messageDisplay.onMessageDisplayed.addListener(handleMessage);

async function handleMessage(tab, message) {
  // Only remove attachments, if message is junk.
  if (!message.junk) {
    return;
  }

  // browser.MessageDisplayAttachment.removeAttachments is an Experiment API,
  // which operates on the given tab and removes all displayed attachments.
  await browser.MessageDisplayAttachment.removeAttachments(tab.id);
}