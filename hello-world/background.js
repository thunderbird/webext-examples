// Import all functions defined in the messageTools module.
import * as messageTools from '/modules/messageTools.mjs';

// Add a listener for the onNewMailReceived events.
messenger.messages.onNewMailReceived.addListener(async (folder, messages) => {
    let { messageLog } = await messenger.storage.local.get({ messageLog: [] });

    for await (let message of messageTools.iterateMessagePages(messages)) {
        messageLog.push({
            folder: folder.name,
            time: Date.now(),
            message: message
        })
    }

    await messenger.storage.local.set({ messageLog });
})

// Create the menu entries.
let menu_id = await messenger.menus.create({
    title: "Show received email",
    contexts: [
        "browser_action",
        "tools_menu"
    ],
});

// Register a listener for the menus.onClicked event.
await messenger.menus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId == menu_id) {
        // Our menu entry was clicked
        let { messageLog } = await messenger.storage.local.get({ messageLog: [] });

        let now = Date.now();
        let last24h = messageLog.filter(e => (now - e.time) < 24 * 60 * 1000);

        for (let entry of last24h) {
            messenger.notifications.create({
                "type": "basic",
                "iconUrl": "images/internet.png",
                "title": `${entry.folder}: ${entry.message.author}`,
                "message": entry.message.subject
            });
        }
    }
});
