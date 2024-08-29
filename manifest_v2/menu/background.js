import * as menus from "/modules/menus.js"

/**
 * In order to override entries in the context menu of action popups, add entries
 * to the "tab" context using the "popup" viewType.
 * 
 * In order to override entries of context menus of any tab, use the "tab" viewType.
 * 
 * The actual override is caused by calling browser.menus.overrideContext() in
 * the contextmenu event. See popup.js.
 */

// Description (inactive menu entry).
await menus.addEntry({
  contexts: ["tab"],
  viewTypes: ["popup"],
  documentUrlPatterns: ["moz-extension://*/popup.html"],
  id: "desc",
  enabled: false,
  title: "Description"
});

// Separator.
await menus.addEntry({
  contexts: ["tab"],
  viewTypes: ["popup"],
  documentUrlPatterns: ["moz-extension://*/popup.html"],
    id: "separator1",
  type: "separator",
});

// Item 1.
await menus.addEntry({
  contexts: ["tab"],
  viewTypes: ["popup"],
  documentUrlPatterns: ["moz-extension://*/popup.html"],
  id: "item1",
  enabled: true,
  title: "Item1"
});

// Item 2.
await menus.addEntry({
  contexts: ["tab"],
  viewTypes: ["popup"],
  documentUrlPatterns: ["moz-extension://*/popup.html"],
  id: "item2",
  enabled: true,
  title: "Item2"
});


/**
 * Add menu entries to multiple different contexts.
 * 
 * We deliberately do not do this in the onInstalled event, to see how our helper
 * function menus.addEntry() is handling the situation.
 * 
 * Note: The entry added to the "tab" context will also show up in the overridden
 * context menu of action popups.
 */

let contexts = [
  "audio",
  "compose_action",
  "message_display_action",
  "editable",
  "compose_body",
  "frame",
  "image",
  "link",
  "password",
  "selection",
  "tab",
  "video",
  "message_list",
  "folder_pane",
  "compose_attachments",
  "tools_menu",
  "browser_action"
];

for (let context of contexts) {
  await menus.addEntry({
    id: context,
    title: `This is the "${context}" context`,
    contexts: [context],
  });
}


/**
 * Add some listeners.
 */

browser.menus.onShown.addListener((...args) => {
  console.log("onShown",...args)
});

browser.menus.onClicked.addListener((...args) => {
  console.log("onClicked",...args)
});
