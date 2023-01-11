// Thunderbird can terminate idle backgrounds in manifest v3.
// This listener will be registered as a persistent listener on add-on startup
// and the background will wake up (restart), each time the event is fired. 
browser.action.onClicked.addListener(async () => {
  browser.tabs.create({ url: browser.runtime.getURL("page.html") });
});
