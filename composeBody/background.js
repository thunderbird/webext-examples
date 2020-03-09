browser.composeAction.onClicked.addListener(async (tab) => {
  // Get the existing message.
  let details = await browser.compose.getComposeDetails(tab.id);
  console.log(details);

  if (details.isPlainText) {
    // The message is being composed in plain text mode.
    let body = details.plainTextBody;
    console.log(body);

    // Make direct modifications to the message text, and send it back to the editor.
    body += "\n\nSent from my Thunderbird";
    console.log(body);
    browser.compose.setComposeDetails(tab.id, { plainTextBody: body });
  } else {
    // The message is being composed in HTML mode. Parse the message into an HTML document.
    let document = new DOMParser().parseFromString(details.body, "text/html");
    console.log(document);

    // Use normal DOM manipulation to modify the message.
    let para = document.createElement("p");
    para.textContent = "Sent from my Thunderbird";
    document.body.appendChild(para);

    // Serialize the document back to HTML, and send it back to the editor.
    let html = new XMLSerializer().serializeToString(document);
    console.log(html);
    browser.compose.setComposeDetails(tab.id, { body: html });
  }
});
