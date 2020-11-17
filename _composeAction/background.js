messenger.composeAction.onClicked.addListener(async (tab) => {
  console.log(await messenger.compose.getComposeDetails(tab.id));

  await browser.tabs.executeScript(tab.id, {
    code: `
      document.execCommand("insertText", false, "Text to insert into message");
      document.execCommand("InsertImage", false, "http://placekitten.com/200/300");
      `
  })

  
});