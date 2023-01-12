## API List

This extension displays a list of all currently available WebExtension APIs. It's not very intelligent, it just looks for all members of the `browser` object and displays them.

All available permissions are asked for, which might result in warning messages about APIs that haven't yet been released.

### Required changes for manifest v3

The `browser_action` manifest entry had to be changed into an `action` manifest key and all call to
`browser.browserAction.*` had to be replaced by `browser.action.*`.
