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
