## Activity Manager Experiment Example

This extension uses an Experiment to add a custom event to the *Clear List* button of the Activity Manager.

Since the Activity Manager is not supported by WebExtension APIs, the `windows` API cannot be used to detect the window being opened. Instead, this example is using a global window listener to detect and manipulate the Activity Manager.

The Experiment defines an `ActivityManager.onCommand` event, which is fired when the *Clear List* button is clicked.

This extension also shows how to load a system module, which involves registering a custom `resource://` url.
