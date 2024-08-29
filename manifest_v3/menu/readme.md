## Using the menus API to add menu entries and to override default context menus in content (action popups or tabs)

This extension uses the menus API to add entries to different menus. 

![image](https://github.com/user-attachments/assets/69989e08-2b81-49d9-a7ad-93e71040a1cf)

It is also shown how to override the context menu of content pages (in popups or tabs).

![image](https://github.com/user-attachments/assets/79bd4067-c666-47ae-9a6c-bfdcd7ef1710)

### Differences from the version for Manifest V2

In Manifest V3, menu entries are not unregistered, when the background is terminated, even though the entries are no longer shown. A restarting background or a restarting extension will therefore cause an error when it tries to re-add the already existing entries.

One can either catch the error (as done by the `addEntry()` helper function of the provided `menus` module), or add menu entries only in the `browser.runtime.onInstalled` event.
