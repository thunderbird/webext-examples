/**
 * This example extension is based on work from:
 *  - e-gaulue
 *  - rholeczy
 */


// Listener for messages received from the background.
browser.runtime.onMessage.addListener((data, sender) => {
  if (data.command == "hideSpinner") {
    document.getElementById("loader").setAttribute("style", "display:none");
  }

  if (data.command == "prepareMessageBody") {
    let mainDiv = document.createElement("div");
    mainDiv.id = "mainDiv";
    mainDiv.setAttribute("style", "display: flex;");

    let firstDiv = document.createElement("div");
    firstDiv.id = "firstDiv";
    firstDiv.setAttribute("style", "flex-grow: 1");
    mainDiv.appendChild(firstDiv);

    let secondDiv = document.createElement("div");
    secondDiv.id = "secondDiv";
    secondDiv.setAttribute("style", "width: 170px;padding-left:5px;");
    mainDiv.appendChild(secondDiv);

    let loader = new Image();
    loader.id = "loader";
    loader.src =
      "data:image/gif;base64,R0lGODlhEAALAPQAAO/v72ZmZtvb29XV1eTk5GhoaGZmZn5+fqurq5mZmcrKynd3d42Nja+vr5ubm8vLy3l5eWdnZ4+Pj+Hh4dra2unp6YODg9zc3Ofn58fHx7u7u9LS0uXl5QAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA";
    loader.style.float = "right";
    secondDiv.appendChild(loader);
    
    // Move content of body into firstDiv.
    while (document.body.firstChild) {
      firstDiv.appendChild(document.body.firstChild);
    }
    // Add mainDiv to empty body.
    document.body.appendChild(mainDiv);
    
  }

  if (data.command === "addImagePreview") {
    let image = new Image();
    image.src = data.imageDataUrl;
    image.style.width = `${data.width}px`;
    image.style["margin-bottom"] = "10px";
    image.style.border = "1px solid black";

    image.addEventListener("click", event => {
      // Open a bigger popup preview, when the preview image has been clicked.
      browser.runtime.sendMessage({
        command: "openPopupPreview",
        partName: data.partName,
        pageNumber: data.pageNumber,
        messageId: data.messageId,
      });
    });

    // Add the image before the last element.
    document
      .getElementById("secondDiv")
      .insertBefore(image, document.getElementById("loader"));
  }
});

browser.runtime.sendMessage({ command: "addInlinePreviews" });
