## Using the menus API to add menu entries and to override default context menus in content (action popups or tabs)

This extension uses the menus API to add entries to different menus. 

It is also shown how to override the context menu of content pages (in popups or tabs).

### Differences from the version for Manifest V2

In Manifest V3, menu entries are not unregistered, when the background is terminated, even though the entries are no longer shown. A restarting background or a restarting extension will therefore cause an error when it tries to re-add the already existing entries.

One can either catch the error (as done by the `addEntry()` helper function of the provided `menus` module), or add menu entries only in the `browser.runtime.onInstalled` event.