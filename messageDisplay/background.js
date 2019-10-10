browser.messageDisplay.onMessageDisplayed.addListener((tabId, message) => {
  console.log(`Message displayed in tab ${tabId}: ${message.subject}`);
});
