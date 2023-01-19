let separatorIdCounter = 0;
function addPopupContextMenuSeparator(parentId = undefined) {
  return addPopupContextMenuEntry({
    id: `separator-${separatorIdCounter++}`,
    type: "separator",
    parentId,
  });
}

function addPopupContextMenuEntry(properties) {
  return browser.menus.create({
    ...properties,
    contexts: ["tab"],
    viewTypes: ["popup", "tab"],
    documentUrlPatterns: ["moz-extension://*/popup.html"],
  });
}
/*
let contexts = [
  "audio",
  "compose_action",
  "message_display_action",
  "editable",
  "compose_body",
  "frame",
  "image",
  "link",
  //"page",
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
  browser.menus.create({
    id: context,
    title: context,
    contexts: [context],
  });
}
*/
browser.menus.onShown.addListener((...args) => {
  console.log("onShown",...args)
});

browser.menus.onClicked.addListener((...args) => {
  console.log("onClicked",...args)
});


// Create menu entries in the popup context menu.
addPopupContextMenuEntry({
  id: "desc",
  enabled: false,
  title: "Description"
});

addPopupContextMenuSeparator();

addPopupContextMenuEntry({
  id: "item1",
  enabled: true,
  title: "Item1"
});

addPopupContextMenuEntry({
  id: "item2",
  enabled: true,
  title: "Item2"
});


console.log("Done");
