/*
----------------------------------------------------------------
This extension for Thunderbird was made by : e-gaulue & rholeczy
                        © 2021
----------------------------------------------------------------
*/

var divCree = false;

// RH : Listener if we received a message.
browser.runtime.onMessage.addListener((data, sender) => {
  if (data.lastPage == true) {
    document.getElementById("monloader").setAttribute("style", "display:none");
  }

  if (data.file_type == "waiter") {
    if (divCree == false) {
      // RH : We build the html page for preview the message.
      let bodyA = document.body.innerHTML;
      document.body.innerHTML = "";

      let mainDiv = document.createElement("div");
      mainDiv.setAttribute("style", "display: flex;");
      document.body.appendChild(mainDiv);
      mainDiv.id = "mainDiv";

      let firstDiv = document.createElement("div");
      mainDiv.appendChild(firstDiv);
      firstDiv.setAttribute("style", "flex-grow: 1");
      firstDiv.innerHTML = bodyA;

      let secondDiv = document.createElement("div");
      secondDiv.setAttribute("style", "width: 170px;padding-left:5px;");
      mainDiv.appendChild(secondDiv);

      firstDiv.id = "firstDiv";
      secondDiv.id = "secondDiv";

      let loader = new Image();
      loader.id = "monloader";
      loader.src = data.img;
      secondDiv.appendChild(loader);
      divCree = true;
    }
  }

  // RH : This is the image who contains the page of the pdf document or just the image of the attachment.
  if (data.type === "handle_me") {
    let image = new Image();
    image.src = data.image;
    image.setAttribute(
      "style",
      "width:160;margin-bottom:10px;border:1px solid black;"
    );

    image.addEventListener("click", event => {
      // Send a message when click on an page or image.
      browser.runtime.sendMessage({
        part_name: data.part_name,
        numPage: data.numPage,
        messageId: data.messageId,
      }); 
    });

    // Add the image before the last element.
    document
      .getElementById("secondDiv")
      .insertBefore(image, document.getElementById("monloader"));

    return Promise.resolve("done");
  }
  return false;
});

browser.runtime.sendMessage({ initialized: true });
