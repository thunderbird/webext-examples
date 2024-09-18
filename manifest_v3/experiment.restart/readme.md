## Restart Experiment

This extension uses an Experiment to add a *Restart* entry to Thunderbird's *file menu* to perform a restart.

In order to add the restart button to already open windows and all windows which are opened in the future, the example uses the WebExtension `windows` API. The Experiment defines a `Restart.onCommand` event, which is fired when the custom *Restart* menu item clicked. The background script registers a listener for this event and calls `Restart.execute()` after a delay of 5s.

### Differences from the version for Manifest V2

The implementation of the `Restart` Experiment had to be updated to support
persistent event listeners. 

The background script is executed every time the extension is resumed by a persistent listener. This causes the code which overlays all open windows to be re-run.

This could have been fixed in the Experiment by not re-adding the element if it exists already. However, the mitigation implemented here uses a flag in the session storage (it is only cleared on normal add-on shut down, but not when terminated):

```javascript
let { startup } = await browser.storage.session.get({ startup: true });
if (startup) {
    await browser.storage.session.set({ startup: false });

    // Overlay all already open normal windows.
    let windows = await browser.windows.getAll({ windowTypes: ["normal"] })
    for (let window of windows) {
        await addRestartMenu(window);
    }
}
```