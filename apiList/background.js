if ("browserAction" in browser) {
  browser.browserAction.onClicked.addListener(async () => {
    browser.tabs.create({ url: "apis.html" });
  });
} else {
  browser.tabs.create({ url: "apis.html" });
}

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

