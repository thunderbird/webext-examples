browser.tabs.query({
  active: true,
  currentWindow: true,
}).then(tabs => {
  let tabId = tabs[0].id;
  browser.messageDisplay.getDisplayedMessages(tabId).then(([message]) => {
    document.body.textContent = message.subject;
  });
});
