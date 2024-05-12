## API List

This extension displays a list of all currently available WebExtension APIs. It's not very intelligent, it just looks for all members of the `browser` object and displays them.

All available permissions are asked for, which might result in warning messages about APIs that haven't yet been released.

### Differences from the version for Manifest V2

The `browser_action` manifest entry had to be changed into an `action` manifest key and all calls to
`browser.browserAction.*` had to be replaced by `browser.action.*`.

The methods `tabs.executeScript()` and `tabs.insertCSS()` have been moved to the `browser.scripting.*` namespace and require the additional `scripting` permission.
