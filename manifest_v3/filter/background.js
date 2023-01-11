// Thunderbird can terminate idle backgrounds in manifest v3.
// Any listener directly added during add-on startup will be registered as a
// persistent listener and the background will wake up (restart) each time the
// event is fired. 

browser.action.disable();

browser.mailTabs.onSelectedMessagesChanged.addListener(async (tab, messageList) => {
  let messageCount = messageList.messages.length;
  if (messageCount == 1) {
    browser.action.enable(tab.id);
  } else {
    browser.action.disable(tab.id);
  }
});

// According to 
// https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/
// the menus.create() statements should be placed inside an onInstalled listener:
//  "Place menu creation using menus.create in a runtime.onInstalled listener."
// But that has not yet been fully implemented, so they still need to be placed
// here. Bug 1771328.
browser.menus.create({
  id: "sender",
  title: "Sender",
  contexts: ["message_list"],
});
browser.menus.create({
  id: "recipients",
  title: "Recipients",
  contexts: ["message_list"],
});
browser.menus.create({
  id: "subject",
  title: "Subject",
  contexts: ["message_list"],
});

// menus.create no longer supports the onclick property in manifest v3, instead
// an onClicked event has to be used.
browser.menus.onClicked.addListener(async (info) => {
  console.log(info);
  let message = info.selectedMessages.messages[0];
  let text = {}
  switch (info.menuItemId) {
    case "subject":
      text = { text: message.subject, subject: true }
    break;
    case "recipients":
      text = { text: message.recipients.join(", "), recipients: true }
      break;
    case "sender":
      text = { text: message.author, author: true }
    break;
  }
  await browser.mailTabs.setQuickFilter({ text });
})

browser.menus.onShown.addListener((info) => {
  let oneMessage = info.selectedMessages && info.selectedMessages.messages.length == 1;
  browser.menus.update("sender", { visible: oneMessage });
  browser.menus.update("recipients", { visible: oneMessage });
  browser.menus.update("subject", { visible: oneMessage });
  browser.menus.refresh();
});
