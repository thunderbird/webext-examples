browser.browserAction.disable();

browser.mailTabs.onSelectedMessagesChanged.addListener(async (tabId, messageList) => {
  let messageCount = messageList.messages.length;
  if (messageCount == 1) {
    browser.browserAction.enable(tabId);
  } else {
    browser.browserAction.disable(tabId);
  }
});

browser.menus.create({
  id: "sender",
  title: "Sender",
  async onclick(info) {
    let message = info.selectedMessages.messages[0];
    await browser.mailTabs.setQuickFilter({
      text: {
        text: message.author,
        sender: true,
      },
    });
  },
});
browser.menus.create({
  id: "recipients",
  title: "Recipients",
  async onclick(info) {
    let message = info.selectedMessages.messages[0];
    await browser.mailTabs.setQuickFilter({
      text: {
        text: message.recipients.join(", "),
        recipients: true,
      },
    });
  },
});
browser.menus.create({
  id: "subject",
  title: "Subject",
  async onclick(info) {
    let message = info.selectedMessages.messages[0];
    await browser.mailTabs.setQuickFilter({
      text: {
        text: message.subject,
        subject: true,
      },
    });
  },
});

browser.menus.onShown.addListener((info) => {
  let oneMessage = info.selectedMessages && info.selectedMessages.messages.length == 1;
  browser.menus.update("sender", { visible: oneMessage });
  browser.menus.update("recipients", { visible: oneMessage });
  browser.menus.update("subject", { visible: oneMessage });
  browser.menus.refresh();
});
