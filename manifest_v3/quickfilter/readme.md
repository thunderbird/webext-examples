## Quickfilter

This extension uses the `mailTabs` API, the `messages` API and the `menus` API to add a *Filter* context menu to the message list which can set certain quickfilter settings.

### Differences from the version for Manifest V2

The `browser_action` manifest entry had to be changed into an `action` manifest key and all calls to
`browser.browserAction.*` had to be replaced by `browser.action.*`.

Adding an `onclick` callback function to the `createData` parameter of `browser.menus.create()` is no longer
supported and had to be replaced by a `menus.onClicked` event listener.
