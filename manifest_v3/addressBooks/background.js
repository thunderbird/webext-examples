// Thunderbird can terminate idle backgrounds in Manifest V3.
// Any listener directly added during add-on startup will be registered as a
// persistent listener and the background will wake up (restart) each time the
// event is fired. 

browser.action.onClicked.addListener(async () => {
  browser.tabs.create({ url: browser.runtime.getURL("page.html") });
});
