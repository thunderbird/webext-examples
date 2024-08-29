window.addEventListener("load", async () => {
  const [tab] = await browser.tabs.query({
    currentWindow: true,
    active: true,
  });

  document.addEventListener("contextmenu", 
    (e) => {
      // The override could be selective, see
      // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus/overrideContext#examples
    console.log("Overriding default context menu.")
    browser.menus.overrideContext({ context: "tab", tabId: tab.id });
    },
    { 
      capture: true
    }
  );
});
