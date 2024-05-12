## Inline Attachment Preview

This extension uses the `listAttachments()` and `getAttachmentFile()` functions of the `messages`API to extract attached PDFs and images. The `messageDisplayScript` API is used to generate inline previews.

The PDF Icon is taken from [freeicons.io](https://freeicons.io/logos/pdf-icon-2304) and is released under Creative Commons (Attribution 3.0 unported).

### Differences from the version for Manifest V2

The `messageDisplayScripts` API is not yet compatible with Manifest V3. Its usage
was replaced by a `messageDisplay.onMessageDisplayed` listener and the scripting API:

```
browser.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
  // Inject script.
  await browser.scripting.executeScript({
    target: { tabId: tab.id},
    files: ["initial.js"]
  })
});
```
