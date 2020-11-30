## Await Popup

This extension opens a popup and awaits user feedback. It uses the WebExtension windows API to create the popup and uses the messaging system to receive notifications from the popup and waits for the `onRemoved` event before returning.
