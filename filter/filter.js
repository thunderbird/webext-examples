for (let key of ["sender", "recipients", "subject"]) {
  let button = document.getElementById(key);
  button.textContent = browser.i18n.getMessage(key);
  button.onclick = async () => {
    let messageList = await browser.mailTabs.getSelectedMessages();
    if (messageList.messages.length != 1) {
      return;
    }
    let message = messageList.messages[0];
    let text;
    switch (key) {
      case "sender":
        text = message.author;
        break;
      case "recipients":
        text = message.recipients.join(", ");
        break;
      case "subject":
        text = message.subject;
        break;
    }
    await browser.mailTabs.setQuickFilter({
      text: {
        text,
        [key]: true,
      },
    });
    window.close();
  };
}
