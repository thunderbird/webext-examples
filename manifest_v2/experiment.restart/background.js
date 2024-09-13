// Add event to react to click on custom restart menu entry.
await browser.Restart.onCommand.addListener(async (windowId) => {
    browser.notifications.create({
        "type": "basic",
        "title": "Restart",
        "message": `The restart menu item was clicked in window with id ${windowId}. Restart in 5 seconds.`
    })
    await new Promise(resolve => window.setTimeout(resolve, 5000));

    // Use the restart Experiment API to restart TB.
    messenger.Restart.execute();
});

// Overlay all already open normal windows.
let windows = await browser.windows.getAll({ windowTypes: ["normal"] })
for (let window of windows) {
    await addRestartMenu(window);
}

// Overlay any new normal window being opened.
browser.windows.onCreated.addListener(addRestartMenu);

async function addRestartMenu(window) {
    await browser.Restart.addMenuEntry(window.id)
}
