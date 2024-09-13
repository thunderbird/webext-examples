// Thunderbird can terminate idle backgrounds in Manifest V3.
// Any listener directly added during add-on startup in the top level scope will
// be registered as a persistent listener and the background will wake up (restart)
// each time the event is fired. Listeners have to be registered before the first
// occurrence of an await keyword.

// Add event to react to click on custom restart menu entry.
browser.Restart.onCommand.addListener(async (windowId) => {
    browser.notifications.create({
        "type": "basic",
        "title": "Restart",
        "message": `The restart menu item was clicked in window with id ${windowId}. Restart in 5 seconds.`
    })
    await new Promise(resolve => window.setTimeout(resolve, 5000));

    // Use the restart Experiment API to restart TB.
    messenger.Restart.execute();
});

// Overlay any new normal window being opened.
browser.windows.onCreated.addListener(addRestartMenu);

async function addRestartMenu(window) {
    await browser.Restart.addMenuEntry(window.id)
}

// In Manifest V3, the background script is executed when the extension is
// resuming after being terminated. In this case we do not want to retrigger our
// overlay code. We use the session storage, which is cleared every time the
// add-on is shut down normally, but not when terminated.
let { startup } = await browser.storage.session.get({ startup: true });
if (startup) {
    await browser.storage.session.set({ startup: false });

    // Overlay all already open normal windows.
    let windows = await browser.windows.getAll({ windowTypes: ["normal"] })
    for (let window of windows) {
        await addRestartMenu(window);
    }
}
