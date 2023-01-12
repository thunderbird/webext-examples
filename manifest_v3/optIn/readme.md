## Opt-In Screen

This extension shows how to ask the user for extended consent before using the add-on.

### Differences from the version for manifest v2

The manifest v2 version of this extension was adding a temporary `runtime.onMessage`
event listener for the opened prompt tab. Such listeners are not registered as a
persistent listener and will not wake up the background, after the tab stays open
longer then the background idle timeout without the user interacting with it.

This example extension was updated using a global persistent `runtime.onMessage`
event listener. 

Alternatively, the tab could send a periodic ping to the `runtime.onMessage` listener
in the background to keep the background busy. The `awaitPopup` example extension
has been updated using the periodic ping approach.
