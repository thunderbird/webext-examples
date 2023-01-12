## Sobriety

This extension shows one way to use the `compose.onBeforeSend`.

In `background.js` the extension listens for `onBeforeSend` events, opening a `composeAction` popup
in the composition window that fired the event. If the user is not sober enough to correctly answer
a simple equation, sending the message is prevented.

The event listener returns a `Promise` rather than a direct response to the event. This allows other
things to happen (opening the popup and waiting for a response) but it should be used with caution.
The composition window is locked until the `Promise` is resolved, and if it is never resolved the
user will be unable to do anything with the message (even save it).

### Required changes for manifest v3

No code changes needed. All event listener where already registered at the top level file scope.

**Note:** The onBeforeSend event is not yet 100% compatible with manifest v3. The
       background page can detect if event listeners are returning Promises and
       is actually able to ignore termination requests if they have not yet been
       fulfilled. However D155071 (Bug 1785294) enforces termination after the
       second termination request (ca 60s). That dead-locks the compose window.
