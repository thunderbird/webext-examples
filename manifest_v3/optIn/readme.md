## Opt-In Screen

This extension shows how to ask the user for extended consent before using the add-on.

### Required changes for manifest v3

The extension was adding a temporary `runtime.onMessage` event listener for
the opened prompt tab. This listener is not registered as persistent and will
not wake up the background, after the tab stays open longer then the background
idle timeout without the user interacting with it.

The tab could send a periodic ping to the `runtime.onMessage` listener in
the background to keep the background busy. The example however was updated
to use a global persistent `runtime.onMessage` event listener.
