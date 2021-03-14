async function main() {
  let url = new URL(window.location.href);
  let tabId = parseInt(url.searchParams.get("tabId"), 10);
  
  let messages = await browser.messageDisplay.getDisplayedMessages(tabId);
  if (messages.length != 1)
    return;
  
  let attachments = await messenger.messages.listAttachments(messages[0].id);
  for (let attachment of attachments) {
    console.log(attachment);
    if (!attachment.contentType.toLowerCase().startsWith("image/"))
      continue;
    
    let file = await browser.messages.getAttachmentFile(
      messages[0].id,
      attachment.partName
    );
    let reader = new FileReader();
    attachment.url = await new Promise((resolve) => {
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
    
    let img = document.createElement("img");
    img.src = attachment.url;
    img.width = "100";
    img.style.margin = "5px";
    img.style.border = "1px solid red";

    document.body.appendChild(img);
  }  
}

main();