// Thunderbird can terminate idle backgrounds in Manifest V3.
// Any listener directly added during add-on startup will be registered as a
// persistent listener and the background will wake up (restart) each time the
// event is fired. 

// Note: The `onBeforeSend` event could cause a long idle time, which will
//   terminate the background page and dead-lock the compose window. To mitigate
//   this limitation introduced in Manifest V3, we use the alarms API to ping
//   the background page.

let promiseMap = new Map();
browser.composeAction.disable();

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

browser.runtime.onMessage.addListener(message => {
  let resolve = promiseMap.get(message.tabId);
  if (!resolve) {
    // How did we get here?
    return;
  }

  browser.composeAction.disable(message.tabId);
  if (message.didAnswerRight) {
    resolve();
  } else {
    resolve({ cancel: true });
  }
});
