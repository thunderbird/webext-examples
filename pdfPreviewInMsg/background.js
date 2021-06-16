/*
----------------------------------------------------------------
This extension for Thunderbird was made by : e-gaulue & rholeczy
                        © 2021
----------------------------------------------------------------
*/
var initialized;


/**
 * Preview a pdf in the mail.
 * 
 * @param {*} pdf 
 * @param {*} canvas 
 * @param {*} nbP 
 * @param {*} tabid 
 * @param {*} filename 
 * @param {*} messageid 
 */
async function pdfPreviewRH(pdf, canvas, nbP, tabid, filename, messageid) {
  let page = await pdf.getPage(nbP);
  let viewport = await page.getViewport({ scale: 1.0 });
  let scale = Math.min(
    canvas.width / viewport.width,
    canvas.height / viewport.height
  );
  let thumbViewPort = await page.getViewport({ scale });
  let context = canvas.getContext("2d");
  let task = page.render({ canvasContext: context, viewport: thumbViewPort });
  task.promise.then(() => {
    // Convert the pdf's page to an image.
    let urlImage = canvas.toDataURL("image/jpeg"); 
    // Send a message to the tab to do ???
    browser.tabs.sendMessage(tabid, {
      type: "handle_me",
      image: urlImage,
      part_name: filename,
      numPage: nbP,
      messageId: messageid,
    });
  });
}


/**
 * <Description>
 * 
 * @param {*} tabid 
 * @param {*} messageid 
 * @returns 
 */
async function execWhenInitialized(tabid, messageid) {
  if (initialized === false) {
    setTimeout(execWhenInitialized, 50, tabid, messageid);
    return;
  }

  // Get a list of all attachments.
  let attachments = await browser.messages.listAttachments(messageid); 
  let waiter = false;

  for (let attachment of attachments) {
    // If the attachment is an image or a PDF, let the tab display a loading screen.
    if (
      attachment.contentType.toLowerCase().startsWith("application/pdf") ||
      attachment.contentType.toLowerCase().startsWith("image/")
    ) {
      waiter = true;
      // Send a message to the tab to display a loader.
      browser.tabs.sendMessage(tabid, {
        file_type: "waiter",
        img:
          "data:image/gif;base64,R0lGODlhEAALAPQAAO/v72ZmZtvb29XV1eTk5GhoaGZmZn5+fqurq5mZmcrKynd3d42Nja+vr5ubm8vLy3l5eWdnZ4+Pj+Hh4dra2unp6YODg9zc3Ofn58fHx7u7u9LS0uXl5QAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA",
      });
    }

    let file = await browser.messages.getAttachmentFile(
      messageid,
      attachment.partName
    );

    let reader = new FileReader();
    attachment.url = await new Promise(resolve => {
      reader.onload = e => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });

    // Handle PDF attachments.
    if (attachment.contentType.toLowerCase().startsWith("application/pdf")) {  
      // Get the file.
      let pdf = pdfjsLib.getDocument(attachment.url).promise; 
      pdf.then(pdf => {
          // Loop over all pages in our document.
          for (let i = 1; i <= pdf._pdfInfo.numPages; i++) {
          if (i >= 4) {
            break;
          }
          let moncanvas = document.createElement("canvas");
          moncanvas.width = 160;
          moncanvas.height = moncanvas.width * 1.5;
          // Generate a preview for each page.
          pdfPreviewRH(
            pdf,
            moncanvas,
            i,
            tabid,
            attachment.partName,
            messageid
          ); 
        }
      });
    }

    // Handle image attachments.
    if (attachment.contentType.toLowerCase().startsWith("image/")) {
      // Send a message to the tab to do ???
      browser.tabs.sendMessage(tabid, {
        type: "handle_me",
        image: attachment.url,
        part_name: attachment.partName,
        messageId: messageid,
      }); 
    }
  }

  if (waiter == true) {
    // Send message to the tab, if we are in the last page.
    browser.tabs.sendMessage(tabid, { lastPage: true }); 
  }
}

browser.runtime.onMessage.addListener(data => {
  // Listener of the sendMessages.
  if (data.initialized === true) {
    initialized = true;
  }

  if (data.part_name != null) {
    if (data.numPage == null) {
      data.numPage = 0;
    }
    messenger.windows.create({
      // Build the popup.
      type: "popup",
      url: `popClick.html?filename=${data.part_name}&numPage=${data.numPage}&messageId=${data.messageId}`,
      width: 600,
      height: 900,
    });
  }

  // Handle file_open requests.
  if (data.file_open != null) {
    let opening = browser.downloads.open(data.file_open); 
    opening.then(() => {});
  }
});

// Register a listener for the messageDisplayed event.
browser.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
  initialized = false;
  execWhenInitialized(tab.id, message.id);
});

browser.messageDisplayScripts.register({ js: [{ file: "initial.js" }] });
