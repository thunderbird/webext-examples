// Thunderbird can terminate idle backgrounds in manifest v3.
// Any listener directly added during add-on startup will be registered as a
// persistent listener and the background will wake up (restart) each time the
// event is fired. 

browser.messageDisplay.onMessageDisplayed.addListener((tab, message) => {
  console.log(`Message displayed in tab ${tab.id}: ${message.subject}`);
});
