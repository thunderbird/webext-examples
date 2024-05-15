## Compose Script

This extension uses the `scripting.compose` API to access and manipulate the content of the message compose window.

It uses `window.getSelection()` to move the cursor behind the added content and imports an [ES6 module](https://github.com/jackbearheart/email-addresses) to parse email addresses.

### Differences from the version for Manifest V2

The `composeScript` API has been replaced by the `scripting.compose` API:

```
await browser.scripting.compose.registerScripts([{
  id: "compose-script-example-1",
  js: ["compose.js"]
}]);
```

The `scripting` permission is now required to inject compose scripts, together with the `compose` permission.