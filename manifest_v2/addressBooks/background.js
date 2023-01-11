browser.browserAction.onClicked.addListener(async () => {
   browser.tabs.create({ url: browser.runtime.getURL("page.html") });
});
