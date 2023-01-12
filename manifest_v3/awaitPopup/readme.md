## Await Popup

This extension opens a popup window and awaits user feedback. It uses the WebExtension windows API to create the popup. User feedback is received via the WebExtension messaging system and the extension waits for the `onRemoved` event from the windows API before continuing.

### Differences from the version for manifest v2

The `browser_action` manifest entry had to be changed into an `action` manifest key and all call to
`browser.browserAction.*` had to be replaced by `browser.action.*`.

The manifest v2 version of this extension was adding a temporary `runtime.onMessage`
event listener for the opened prompt popup. Such listeners are not registered as
persistent and will not wake up the background, after the popup stays open longer
then the background idle timeout without the user interacting with it.

The popup could send a periodic ping to the `runtime.onMessage` listener in
the background to keep the background busy. The example however was updated
to use a global persistent `runtime.onMessage` event listener.
