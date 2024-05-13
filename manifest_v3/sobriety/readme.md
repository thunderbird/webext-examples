## Sobriety

This extension shows one way to use the `compose.onBeforeSend`.

In `background.js` the extension listens for `onBeforeSend` events, opening a `composeAction` popup
in the composition window that fired the event. If the user is not sober enough to correctly answer
a simple equation, sending the message is prevented.

The event listener returns a `Promise` rather than a direct response to the event. This allows other
things to happen (opening the popup and waiting for a response) but it should be used with caution.
The composition window is locked until the `Promise` is resolved, and if it is never resolved the
user will be unable to do anything with the message (even save it).

### Differences from the version for Manifest V2

The `onBeforeSend` event could cause a long idle time, which will terminate the background page and
dead-lock the compose window. To mitigate this limitation introduced in Manifest V3 ([D155071](https://phabricator.services.mozilla.com/D155071)), we use the alarms API to ping the background page:

```
async function promiseWithoutTermination(name, promise) {
  const listener = (alarmInfo) => {
    if (alarmInfo.name == name) {
      console.info(`Waiting for ${name}`)
    }
  }
  browser.alarms.create(
    name,
    {
      periodInMinutes: 0.25, // 15 seconds
    }
  );
  browser.alarms.onAlarm.addListener(listener);

  const rv = await promise;

  await browser.alarms.clear(name);
  browser.alarms.onAlarm.removeListener(listener);
  return rv;
}

browser.compose.onBeforeSend.addListener(async tab => {
  await browser.composeAction.enable(tab.id);
  await browser.composeAction.openPopup();

  // Do NOT lose this Promise. Most of the compose window UI will be locked
  // until it is resolved. That's a very good way to annoy users.
  let { promise, resolve } = Promise.withResolvers();
  promiseMap.set(tab.id, resolve);
  return promiseWithoutTermination("onBeforeSend", promise);
});
```
