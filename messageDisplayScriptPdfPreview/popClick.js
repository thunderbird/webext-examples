/**
 * This example extension is based on work from:
 *  - e-gaulue
 *  - rholeczy
 */


/**
 * Load a preview of the provided PDF data URL into the specified canvas.
 *
 * @param {String} url - data URL of the PDF attachment
 * @param {HTMLElement} canvas - the HTML canvas Element to render the preview in
 * @param {Integer} pageNumber - the page number of the PDF document to be rendered
 */
async function pdfPreview(url, canvas, pageNumber) {
  // We actually use the canvas to display the PDF preview. We could have also
  // used a temporary canvas and extract its image data URL as done for the
  // inline previews. Using the canvas directly is faster.
  let pdf = await pdfjsLib.getDocument(url).promise;
  if (pageNumber > pdf._pdfInfo.numPages) {
    pageNumber = pdf._pdfInfo.numPages;
  }

  let page = await pdf.getPage(pageNumber);
  let viewport = await page.getViewport({ scale: 1.0 });
  let scale = Math.min(
    canvas.width / viewport.width,
    canvas.height / viewport.height
  );
  let thumbViewPort = await page.getViewport({ scale });
  let context = canvas.getContext("2d");
  page.render({ canvasContext: context, viewport: thumbViewPort });
}

/**
 * Generate a big preview of the attached PDF or image.
 */
async function generateBigPreview() {
  // Get the URL of the document.
  let url = new URL(window.location.href);

  // Get the paramter values passed in via the page URL.
  // * messageId - id of the WebExtension MessageHeader of the selected message
  // * partName - the name of the MIME part of selected PDF attachment
  // * pageNumber - the selected page of the selected PDF attachment
  let messageId = parseInt(url.searchParams.get("messageId"));
  let partName = url.searchParams.get("partName");
  let pageNumber = parseInt(url.searchParams.get("pageNumber"));

  // Find the requested attachment, abort if not found.
  let attachments = await messenger.messages.listAttachments(messageId);
  let attachment = attachments.find(a => a.partName == partName);
  if (!attachment) {
    return;
  }

  // Use the filename as description, if possible.
  let description = attachment.name || `mime_part_${partName}`;
  if (pageNumber) description += ` (page ${pageNumber})`;

  // Get the requested attachment.
  let file = await messenger.messages.getAttachmentFile(messageId, partName);
  // Get a data URL of the attachment.
  let reader = new FileReader();
  attachment.url = await new Promise(resolve => {
    reader.onload = e => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  });

  // Clone the HTML template.
  let t = document.querySelector("#attachmentTemplate");
  let attachmentElement = document.importNode(t.content, true); 
  attachmentElement.querySelector("p").textContent = description;

  // Handle image attachments.
  if (attachment.contentType.toLowerCase().startsWith("image/")) {
    attachmentElement.querySelector("img").src = attachment.url;
  } else {
    attachmentElement.querySelector("img").style.display = "none";
  }

  // Handle PDF attachments.
  if (attachment.contentType.toLowerCase() == "application/pdf") {
    pdfPreview(
      attachment.url,
      attachmentElement.querySelector("canvas"),
      pageNumber
    );
  } else {
    attachmentElement.querySelector("canvas").style.display = "none";
  }
  
  document.body.appendChild(attachmentElement);
}

generateBigPreview();
