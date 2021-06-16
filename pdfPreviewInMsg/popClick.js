/*
----------------------------------------------------------------
This extension for Thunderbird was made by : e-gaulue & rholeczy
                        © 2021
----------------------------------------------------------------
*/

/**
 * We preview the pdf in the new window.
 * 
 * @param {*} url : URL of the attachement
 * @param {*} canvas : This is the canvas we used to show a page
 * @param {*} nbP : Number of page
 */
async function pdfPreview(url, canvas, nbP) {
    let pdf = await pdfjsLib.getDocument(url).promise;
    let page = await pdf.getPage(nbP);
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
 * Convert our attachement to document
 */
async function generateThumbs() {
    let url = new URL(window.location.href); // RH : We get the URL of the document.
    let messageId = await parseInt(url.searchParams.get("messageId")); // rh :We get the messageID in the parameters of the URL.
    let partname = await url.searchParams.get("partname"); // RH : We get the partName in the parameters of the URL.
    let numPage = await parseInt(url.searchParams.get("numPage")); // RH : We get the number of the pages in the parameters of the URL.
    let attachments = await messenger.messages.listAttachments(messageId);
    for (let attachment of attachments) {
        if (attachment.partName == partname) {
            // RH : If the partname get == the partname of the for
            let file = await messenger.messages.getAttachmentFile(
                messageId,
                attachment.partName
            );
            let reader = new FileReader();
            attachment.url = await new Promise(resolve => {
                reader.onload = e => {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(file);
            });

            let id = `attachmentElement_${messageId}_${attachment.partName}`;
            let t = document.querySelector("#attachmentTemplate");
            t.content.querySelector("div").id = id;
            t.content.querySelector("p").textContent = partname;
            document.body.appendChild(document.importNode(t.content, true));

            // Event listeners cannot be attached to documentFragments before being added
            // to the DOM. Find the new element.
            let attachmentElement = document.getElementById(id);

            for (let button of attachmentElement.querySelectorAll("button")) {
                button.setAttribute("data-message-id", messageId);
                button.setAttribute("data-attachment-part-name", attachment.partName);
                button.addEventListener("click", clickHandler);
            }

            if (attachment.contentType.toLowerCase().startsWith("image/")) {
                attachmentElement.querySelector("img").src = attachment.url;
            }
            // RH : We put our image in attachment.
            else {
                attachmentElement.querySelector("img").style.display = "none";
            }

            if (attachment.contentType.toLowerCase() == "application/pdf") {
                pdfPreview(
                    attachment.url,
                    attachmentElement.querySelector("canvas"),
                    numPage
                ); // We call the function pdfPreview.
            } else {
                attachmentElement.querySelector("canvas").style.display = "none";
            }
        }
    }
}

async function clickHandler(e) {
    const file = await browser.messages.getAttachmentFile(
        parseInt(e.target.dataset.messageId, 10),
        e.target.dataset.attachmentPartName
    );
    const objectURL = URL.createObjectURL(file);

    switch (e.target.getAttribute("action")) {
        // Open the pdf, but it's not finish, Waiting API developpement
        case "open":
            {
                let id = await browser.downloads.download({
                    partname: `_temp_${file.name}`,
                    saveAs: false,
                    url: objectURL,
                });
                browser.runtime.sendMessage({ file_open: id });
            }
            break;

            // Download the pdf but it's not finish, Waiting API developpement
        case "download":
            {
                await browser.downloads.download({
                    partname: file.name,
                    saveAs: true,
                    url: objectURL,
                });
            }
            break;
    }
}

generateThumbs();