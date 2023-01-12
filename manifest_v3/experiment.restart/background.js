// Thunderbird can terminate idle backgrounds in manifest v3.
// Any listener directly added during add-on startup will be registered as a
// persistent listener and the background will wake up (restart) each time the
// event is fired. 

// Note: In this example the two listeners are added inside an async function, but
//       BEFORE an await is encountered. A listener registered after a function
//       call has been awaited will not be registered as persistent and will not
//       cause the background to wake up.

function addRestartMenuEntry(window) {
    // Skip in case it is not the window we want to manipulate.
    // https://webextension-api.thunderbird.net/en/latest/windows.html#windowtype  
    if (`${window.type}` !== "normal") {
      return;
    }

    // Use the LegacyMenu Experiment API to add a menu entry for the restart menu item.
    const id = `${window.id}`;
    const description = {
      "id":  "menu_FileRestartItem",
      "type": "menu-label",
      "reference": "menu_FileQuitItem",
      "position": "before",
      "label": "Restart",
      "accesskey": "R"
    };
    messenger.LegacyMenu.add(id, description);   
}

async function onCommand(windowsId, itemId) {
    switch (itemId) {
        case "menu_FileRestartItem":
            // Use the restart Experiment API to restart TB.
            messenger.restart.execute();
            break;
    }
}

async function main () {
    // Register a listener for the onClick/onCommand event for any added menu entry.
    messenger.LegacyMenu.onCommand.addListener(onCommand);

    // Register a listener for all newly opened windows so they get manipulated as well.
    messenger.windows.onCreated.addListener(addRestartMenuEntry);

    // Loop over all already open windows and add the restart menu entry.
    const windows = await messenger.windows.getAll();
    for (let window of windows) {
        addRestartMenuEntry(window);
    }

}

//Execute the asynchronous init() function.
main();
