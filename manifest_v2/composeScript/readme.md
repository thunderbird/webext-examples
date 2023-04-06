## Compose Script

This extension uses the `composeScript` API to access and manipulate the content of the message compose window.

It uses `window.getSelection()` to move the cursor behind the added content and imports an [ES6 module](https://github.com/jackbearheart/email-addresses) to parse email addresses.
