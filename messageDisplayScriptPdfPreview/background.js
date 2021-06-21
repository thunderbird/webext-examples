/**
 * This example extension is based on work from:
 *  - e-gaulue
 *  - rholeczy
 */

const PREVIEW_WIDTH = 160;
const PREVIEW_HEIGHT = PREVIEW_WIDTH * 1.5;


/**
 * Generate a data image URL of a scaled down page of a PDF document.
 *
 * @param {PDFDocumentProxy} pdf - the PDF document received from pdf.js
 * @param {Integer} pageNumber - the page number of the PDF document to be rendered
 *
 * returns {String} A data URL of the rendered PDF preview
 */
async function generatePdfImageUrl(pdf, pageNumber, width, height) {
  // The PDF will be rendered into a temporary HTML canvas element.
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  let page = await pdf.getPage(pageNumber);
  let viewport = await page.getViewport({ scale: 1.0 });
  let scale = Math.min(
    canvas.width / viewport.width,
    canvas.height / viewport.height
  );
  let thumbViewPort = await page.getViewport({ scale });
  let context = canvas.getContext("2d");
  await page.render({ canvasContext: context, viewport: thumbViewPort })
    .promise;

  // Extract the image data URL of the rendered PDF from the canvas.
  return canvas.toDataURL("image/jpeg");
}

/**
 * This function reads all attachments and extracts data image URLs for PDFs and
 * standard images and sends those to the requesting tab for display.
 *
 * The pdf.js library is used to render PDFs.
 *
 * @param {Integer} tabId - the id of the WebExtension message display Tab
 * @param {Integer} messageId - the id of the WebExtension MessageHeader
 */
async function addInlinePreviews(tabId, messageId) {
  // Get a list of all attachments.
  let attachments = await browser.messages.listAttachments(messageId);
  let loadingSpinnerShown = false;

  for (let attachment of attachments) {
    // Only image or a PDF attachments are handled.
    if (
      !attachment.contentType.toLowerCase().startsWith("application/pdf") &&
      !attachment.contentType.toLowerCase().startsWith("image/")
    ) {
      continue;
    }

    // There is at least one inline preview. Send a message to the tab to
    // prepare the message body and to display a loading spinner. We do this
    // only once.
    if (!loadingSpinnerShown) {
      await browser.tabs.sendMessage(tabId, { command: "prepareMessageBody" });
      loadingSpinnerShown = true;
    }

    // Get the requested attachment.
    let file = await browser.messages.getAttachmentFile(
      messageId,
      attachment.partName
    );

    // Get a data URL from the attachment.
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
      let pdf = await pdfjsLib.getDocument(attachment.url).promise;

      // Loop over the first 3 pages of the PDF document.
      for (
        let pageNumber = 1;
        pageNumber <= pdf._pdfInfo.numPages && pageNumber < 4;
        pageNumber++
      ) {
        // Generate an image data URL for each page preview.
        let imageDataUrl = await generatePdfImageUrl(pdf, pageNumber, PREVIEW_WIDTH, PREVIEW_HEIGHT);
        // Send a message to the tab to display the preview.
        await browser.tabs.sendMessage(tabId, {
          command: "addImagePreview",
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
          imageDataUrl,
          partName: attachment.partName,
          pageNumber,
          messageId,
        });
      }
    }

    // Handle image attachments.
    if (attachment.contentType.toLowerCase().startsWith("image/")) {
      // Send a message to the tab to display the preview.
      await browser.tabs.sendMessage(tabId, {
        command: "addImagePreview",
        width: PREVIEW_WIDTH,
        height: PREVIEW_HEIGHT,
        imageDataUrl: attachment.url,
        partName: attachment.partName,
        pageNumber: 0,
        messageId,
      });
    }
  }

  // Send a message to the tab to hide the loading spinner again (if shown).
  if (loadingSpinnerShown) {
    await browser.tabs.sendMessage(tabId, { command: "hideSpinner" });
    loadingSpinnerShown = false;
  }
}

browser.runtime.onMessage.addListener((data, sender) => {
  // Handle inline-preview requests.
  if (data.command == "addInlinePreviews") {
    let tabId = sender.tab.id;
    browser.messageDisplay.getDisplayedMessage(tabId).then(message => {
      addInlinePreviews(tabId, message.id);
    });
  }

  // Handle popup-preview requests.
  if (data.command == "openPopupPreview" && data.partName != null) {
    messenger.windows.create({
      url: `popClick.html?partName=${
        data.partName
      }&pageNumber=${data.pageNumber || 0}&messageId=${data.messageId}`,
      type: "popup",
      width: 600,
      height: 940,
    });
  }
});

browser.messageDisplayScripts.register({ js: [{ file: "initial.js" }] });
