## Await Popup

This extension opens a popup and awaits user feedback. It uses the WebExtension windows APIs to create the popup and uses the messaging system to receive notifications from the popup and and waits for the windows.onRemoved event before returning.
