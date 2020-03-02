## Sobriety

This extension shows one way to use the `compose.onBeforeSend` event added in Thunderbird 74,
although due to some bugs it won't work until Thunderbird 74 beta 2.

In `background.js` the extension listens for `onBeforeSend` events, opening a `composeAction` popup
in the composition window that fired the event. If the user is not sober enough to correctly answer
a simple equation, sending the message is prevented.

The event listener returns a `Promise` rather than a direct response to the event. This allows other
things to happen (opening the popup and waiting for a response) but it should be used with caution.
The composition window is locked until the `Promise` is resolved, and if it is never resolved the
user will be unable to do anything with the message (even save it).
