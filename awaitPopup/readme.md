## Await Popup

This extension opens a popup window and awaits user feedback. It uses the WebExtension windows API to create the popup. User feedback is received via the WebExtension messaging system and the extension waits for the `onRemoved` event from the windows API before continuing.
