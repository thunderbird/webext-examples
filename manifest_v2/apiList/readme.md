## API List

This extension displays a list of all currently available WebExtension APIs. It's not very intelligent, it just looks for all members of the `browser` object and displays them.

All available permissions are asked for, which might result in warning messages about APIs that haven't yet been released.

You may notice the list includes `browserAction`, but not `cloudFile` or `composeAction`. Manifest entries are required to see these APIs.
