## Objective

Use this API to add menu items to the Thunderbird UI, as long as it is not yet possible with built-in APIs (like the menus API).

## Usage

In order to add a menu item to a window, you first need to get the handle to that window. The most simple way is to request all currently open windows
and listen for newly opened windows and pass the received window handles to a method, which adds the menu items (if needed). 

A background script could look like the following:

```
(async function() {
  const windows = await messenger.windows.getAll();
  for (let window of windows) {
    manipulateWindow(window);
  }

  messenger.windows.onCreated.addListener((window) => {
    manipulateWindow(window);
  });
})()

function manipulateWindow(window) {
    // Skip in case it is not the window we want to manipulate.
    // https://thunderbird-webextensions.readthedocs.io/en/latest/windows.html#windowtype
    // * normal
    // * popup
    // * panel
    // * app
    // * devtools
    // * addressBook
    // * messageCompose
    // * messageDisplay
   
    if (`${window.type}` !== "normal") {
      return;
    }

    const id = `${window.id}`;
    const description = {
      "id": "menu_CustomItem",
      "type": "menu-label",
      "reference": "activityManager",
      "position": "before",
      "label": "My Custom Menu Item",
      "accesskey": "C"
    };
    messenger.LegacyMenu.add(id, description);   
}

```

The `position` property of the description object passed to `LegacyMenu.add()` supports the following values:
* `before`
* `after`
* `child`

Depending on its value, the new menu item will be inserted `before` or `after` the element identified by the id specified in the `reference` property.
If the position is set to `child`, the new menu entry will be appended to the reference element. 

The `type` property of the description object passed to `LegacyMenu.add()` supports the following values:
* `menu-label` 
* `menu-separator` 
* `appmenu-label` 
* `appmenu-separator`

The `menu-*` types will add an item to the standard window menu, the `appmenu-*` types will add an item to the app menu a.k.a. the hamburger menu.

To attach a command action to any of the added menu items, register the onCommand listener:

```
  messenger.LegacyMenu.onCommand.addListener(
    async (windowsId, id) => {
      if (id == "menu_CustomItem") {
        messenger.windows.create({
          url: "popup.html",
          type: "popup"
        });
      }
    }
  ); 

```

The listener will fire for any of the added menu items and will include the id of the window and the id of the item that has been clicked on.
