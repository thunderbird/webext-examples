## Activity Manager Experiment Example

This extension uses an Experiment to add a custom event to the *Clear List* button of the Activity Manager.

Since the Activity Manager is not supported by WebExtension APIs, the `windows` API cannot be used to detect the window being opened. Instead, this example is using the `startup` event of the Experiment to register a global window listener to detect and manipulate the Activity Manager.

The Experiment defines an `ActivityManager.onCommand` event, which is fired when the *Clear List* button is clicked.

This extension also shows how to load code from a JSM file, which involves registering a custom `resource://` url.

**Note:** Recent versions of Thunderbird have moved to modern ES6 system modules. However, these cannot be used by extensions, because they cannot be unloaded. Unloading modules is crucial for extension to read updated implementations after an add-on update. Since support for JSM files will be dropped, its usage should be removed entirely.
