// Thunderbird can terminate idle backgrounds in manifest v3.
// Any listener directly added during add-on startup will be registered as a
// persistent listener and the background will wake up (restart) each time the
// event is fired. 

// Note: The onBeforeSend event is not yet 100% compatible with manifest v3. The
//       background page can detect if event listeners are returning Promises and
//       is actually able to ignore termination requests if they have not yet been
//       fulfilled. However D155071 (Bug 1785294) enforces termination after the
//       second termination request (ca 60s). That dead-locks the compose window.

let promiseMap = new Map();
browser.composeAction.disable();

browser.compose.onBeforeSend.addListener(tab => {
  browser.composeAction.enable(tab.id);
  browser.composeAction.openPopup();

  // Do NOT lose this Promise. Most of the compose window UI will be locked
  // until it is resolved. That's a very good way to annoy users.
  return new Promise(resolve => {
    promiseMap.set(tab.id, resolve);
  });
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
