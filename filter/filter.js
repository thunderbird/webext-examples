document.getElementById("sender").onclick = async () => {
  let messages = await browser.mailTabs.getSelectedMessages();
  if (messages.length == 0) {
    return;
  }
  await browser.mailTabs.setQuickFilter({ text: messages[0].author, sender: true });
  window.close();
};

document.getElementById("recipients").onclick = async () => {
  let messages = await browser.mailTabs.getSelectedMessages();
  if (messages.length == 0) {
    return;
  }
  await browser.mailTabs.setQuickFilter({ text: messages[0].recipients, recipients: true });
  window.close();
};

document.getElementById("subject").onclick = async () => {
  let messages = await browser.mailTabs.getSelectedMessages();
  if (messages.length == 0) {
    return;
  }
  await browser.mailTabs.setQuickFilter({ text: messages[0].subject, subject: true });
  window.close();
};
