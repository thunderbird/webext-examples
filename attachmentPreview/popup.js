async function pdfPreview(url, canvas) {
//  pdfjsLib.disableWorker = true;
  let pdf = await pdfjsLib.getDocument(url).promise;  
  let page = await pdf.getPage(1);
  let  viewport = await page.getViewport({scale: 1.0});
  let  scale = Math.min(canvas.width / viewport.width, canvas.height / viewport.height);
  let  thumbViewPort = await page.getViewport({scale});  
  let context = canvas.getContext('2d');
  page.render({canvasContext: context, viewport: thumbViewPort});
}


async function generateThumbs() {
  let url = new URL(window.location.href);
  let tabId = parseInt(url.searchParams.get("tabId"), 10);
  
  let messages = await browser.messageDisplay.getDisplayedMessages(tabId);
  if (messages.length != 1)
    return;
  
  let attachments = await messenger.messages.listAttachments(messages[0].id);
  for (let attachment of attachments) {    
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
    
    // Using an html template.
    let id = `attachmentElement_${messages[0].id}_${attachment.partName}`;
    let t = document.querySelector('#attachmentTemplate');
    t.content.querySelector("div").id = id;
    t.content.querySelector("p").textContent = attachment.name;
    document.body.appendChild(document.importNode(t.content, true));
    
    // Event listeners cannot be attached to documentFragments before being added
    // to the DOM. Find the new element.
    let attachmentElement = document.getElementById(id);
    for (let button of attachmentElement.querySelectorAll("button")) {
      button.setAttribute("data-message-id", messages[0].id);
      button.setAttribute("data-attachment-part-name", attachment.partName);
      button.addEventListener("click", clickHandler);
    }

    if (attachment.contentType.toLowerCase().startsWith("image/"))
      attachmentElement.querySelector("img").src = attachment.url;
    else
      attachmentElement.querySelector("img").style.display = "none";

    if (attachment.contentType.toLowerCase() == "application/pdf")
      pdfPreview(attachment.url, attachmentElement.querySelector("canvas"));    
    else
      attachmentElement.querySelector("canvas").style.display = "none";
    
  }  
}

async function clickHandler(e) {
  const file = await browser.messages.getAttachmentFile(
    parseInt(e.target.dataset.messageId, 10),
    e.target.dataset.attachmentPartName
  );
  const objectURL = URL.createObjectURL(file);

  switch (e.target.getAttribute("action")) {
    case "open": {
      let id = await browser.downloads.download({
        filename: `_temp_${file.name}`,
        saveAs: false,
        url: objectURL,
      });
      browser.downloads.open(id);
    }
    break;
    
    case "download": {
      await browser.downloads.download({
        filename: file.name,
        saveAs: true,
        url: objectURL,
      });
      // revoking directly broke the download for me :-(
      //URL.revokeObjectURL(objectURL);
    }
    break;
  }
}

generateThumbs();