## Experiment API

This extension shows how to write an Experiment API including a function and an
event. It also shows how to listen to custom events. 

The Experiment also registers a custom `resource://` url to load a system module
bundled with the extension.
**Note:** Moving code into system modules should be avoided.

For more information, check out the [documentation](https://thunderbird-webextensions.readthedocs.io/en/latest/how-to/experiments.html).

The Experiment registers a click event handler for the primary mouse button on
the unified toolbar and shows an alert box, if triggered. Works best if the search
bar is clicked.
