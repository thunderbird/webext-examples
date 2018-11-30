for (let key of ["sender", "recipients", "subject"]) {
  let button = document.getElementById(key);
  button.textContent = browser.i18n.getMessage(key);
  button.onclick = async () => {
    let messageList = await browser.mailTabs.getSelectedMessages();
    if (messageList.messages.length != 1) {
      return;
    }
    let messageKey = key == "sender" ? "author" : key;
    await browser.mailTabs.setQuickFilter({
      text: {
        text: messageList.messages[0][messageKey],
        [key]: true,
      },
    });
    window.close();
  };
}
