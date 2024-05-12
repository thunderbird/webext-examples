## Await Popup

This extension opens a popup window and awaits user feedback. It uses the WebExtension windows API to create the popup. User feedback is received via the WebExtension messaging system and the extension waits for the `onRemoved` event from the windows API before continuing.

### Differences from the version for Manifest V2

The `browser_action` manifest entry had to be changed into an `action` manifest key and all calls to
`browser.browserAction.*` had to be replaced by `browser.action.*`.

The Manifest V2 version of this extension is adding a temporary `runtime.onMessage`
event listener for the opened prompt popup. Such listeners are not registered
as persistent listeners and will not wake up the background, if the the popup
stays open longer then the background idle timeout without the user interacting
with it.

To make the example work in Manifest V3, the popup sends a periodic ping to a
`runtime.onMessage` listener in the background, to keep the background busy.

Alternatively, a global persistent `runtime.onMessage` event listener could have
been used. The `optIn` example extension has been updated by using such a global
persistent event listener.
