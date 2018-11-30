browser.browserAction.disable();

browser.mailTabs.onSelectedMessagesChanged.addListener(async (tabId, messageList) => {
  let messageCount = messageList.messages.length;
  if (messageCount == 1) {
    browser.browserAction.enable(tabId);
  } else {
    browser.browserAction.disable(tabId);
  }
});
