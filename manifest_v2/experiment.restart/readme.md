## Restart Experiment

This extension uses an Experiment to add a *Restart* entry to Thunderbird's *file menu* to perform a restart.

In order to add the restart button to already open windows and all windows which are opened in the future, the example uses the WebExtension `windows` API. The Experiment defines a `Restart.onCommand` event, which is fired when the custom *Restart* menu item clicked. The background script registers a listener for this event and calls `Restart.execute()` after a delay of 5s.
