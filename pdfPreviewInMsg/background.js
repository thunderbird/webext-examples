/*
----------------------------------------------------------------
This extension for Thunderbird was made by : e-gaulue & rholeczy
                        © 2021
----------------------------------------------------------------
*/


async function pdfPreviewRH(pdf, canvas, nbP, tabid, filename, messageid) { // RH : Preview a pdf in the mail.
    let page = await pdf.getPage(nbP);
    let viewport = await page.getViewport({ scale: 1.0 });
    let scale = Math.min(canvas.width / viewport.width, canvas.height / viewport.height);
    let thumbViewPort = await page.getViewport({ scale });
    let context = canvas.getContext('2d');
    let task = page.render({ canvasContext: context, viewport: thumbViewPort });
    task.promise.then(() => {
        var urlImage = canvas.toDataURL('image/jpeg'); // RH : We convert the pdf's page to an image
        browser.tabs.sendMessage(tabid, { "type": 'handle_me', "image": urlImage, "part_name": filename, "numPage": nbP, "messageId": messageid }); // RH : We send a message with the parameters.
    });
}

var initialized;

async function execwheninitialized(tabid, messageid) {

    if (initialized === false) {
        setTimeout(execwheninitialized, 50, tabid, messageid);
        return;
    }

    let attachments = await browser.messages.listAttachments(messageid); // RH : We get the list of all attachments.
    let waiter = false;

    for (let attachment of attachments) { // RH : For each attachments

        if (attachment.contentType.toLowerCase().startsWith("application/pdf") || attachment.contentType.toLowerCase().startsWith("image/")) { // RH : If our file is an iamge or a pdf DO
            waiter = true;
            //RH : Display a loader.
            browser.tabs.sendMessage(tabid, { "file_type": "waiter", "img": "data:image/gif;base64,R0lGODlhEAALAPQAAO/v72ZmZtvb29XV1eTk5GhoaGZmZn5+fqurq5mZmcrKynd3d42Nja+vr5ubm8vLy3l5eWdnZ4+Pj+Hh4dra2unp6YODg9zc3Ofn58fHx7u7u9LS0uXl5QAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA" });
        }
        let file = await browser.messages.getAttachmentFile(
            messageid,
            attachment.partName
        );

        let reader = new FileReader();
        attachment.url = await new Promise((resolve) => {
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        });

        if (attachment.contentType.toLowerCase().startsWith("application/pdf")) { //RH : If our file is a pdf DO
            var pdf = pdfjsLib.getDocument(attachment.url).promise; // RH : We get the file
            pdf.then((pdf) => {
                for (let i = 1; i <= pdf._pdfInfo.numPages; i++) { // RH : For each pages in our document
                    if (i >= 4) { break; }
                    var moncanvas = document.createElement('canvas');
                    moncanvas.width = 160;
                    moncanvas.height = moncanvas.width * 1.5;
                    pdfPreviewRH(pdf, moncanvas, i, tabid, attachment.partName, messageid); // RH : For each pages we will do a preview.
                }
            });
        }
        if (attachment.contentType.toLowerCase().startsWith("image/")) { // RH : If our document is an image
            browser.tabs.sendMessage(tabid, { "type": 'handle_me', "image": attachment.url, "part_name": attachment.partName, "messageId": messageid }); // We send the message and his parameters.
        }
    }

    if (waiter == true) {
        browser.tabs.sendMessage(tabid, { "dernierePage": true }); // RH : We send message if we are in the last page.
    }
}

browser.runtime.onMessage.addListener((data) => { // Listener of the sendMessages.
    if (data.initialized === true) {
        initialized = true;
    }

    if (data.part_name != null) {
        if (data.numPage == null) { data.numPage = 0; }
        messenger.windows.create({ //We build the popup.
            "type": "popup",
            "url": `popClick.html?filename=${data.part_name}&numPage=${data.numPage}&messageId=${data.messageId}`,
            "width": 600,
            "height": 900
        });
    }

    if (data.file_open != null) { // RH : If we received the data file-open.
        var opening = browser.downloads.open(data.file_open); // RH : We open the file.
        opening.then(() => {});
    }

});


browser.messageDisplay.onMessageDisplayed.addListener(async(tab, message) => { // RH : Event if a mail is displayed.
    initialized = false;
    execwheninitialized(tab.id, message.id);
});

browser.messageDisplayScripts.register({ "js": [{ file: "initial.js" }] });