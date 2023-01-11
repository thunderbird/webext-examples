// Thunderbird can terminate idle backgrounds in manifest v3.
// Any listener directly added during add-on startup will be registered as a
// persistent listener and the background will wake up (restart), each time the
// event is fired. 

browser.action.onClicked.addListener(async () => {
  browser.tabs.create({ url: "apis.html" });
});

async function injectIntoContent(tab, info) {
  await browser.tabs.insertCSS(tab.id, {
    file: "apis.css"
  });
  await browser.tabs.executeScript(tab.id, {
    file: "apis.js"
  })
}

browser.composeAction.onClicked.addListener(injectIntoContent);
browser.messageDisplayAction.onClicked.addListener(injectIntoContent);

