## Address Books

This extension uses the `addressbooks`, `contacts`, and `mailingLists` APIs being implemented in [bug 1469238](https://bugzil.la/1469238) and its dependencies.

*Warning:* you should not run this extension in a Thunderbird profile you care about. There is a chance it could mess up your address books, eat all your RAM, and scare your cat.

### Differences from the version for Manifest V2

The `browser_action` manifest entry had to be changed into an `action` manifest key and all calls to
`browser.browserAction.*` had to be replaced by `browser.action.*`.
