## Inline Attachment Preview

This extension uses the `listAttachments()` and `getAttachmentFile()` functions of the `messages`API to extract attached PDFs and images. The `messageDisplayScript` API is used to generate inline previews.

The PDF Icon is taken from [freeicons.io](https://freeicons.io/logos/pdf-icon-2304) and is released under Creative Commons (Attribution 3.0 unported).

### Required changes for manifest v3

The `messageDisplayScripts` API is not yet compatible with manifest v3. Its usage
was replaced by a `messageDisplay.onMessageDisplayed` listener:

```
browser.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
  // Inject script.
  await browser.tabs.executeScript(tab.id, {
    file: "initial.js"
  })
});
```
