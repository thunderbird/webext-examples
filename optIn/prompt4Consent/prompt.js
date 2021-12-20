document.addEventListener("click", handleClicks);

function handleClicks(event) {
    switch (event.target.id) {
        case "button-ok":
            messenger.runtime.sendMessage({ command: "prompt.clickOk" });
            break;
        case "button-cancel":
            messenger.runtime.sendMessage({ command: "prompt.clickCancel" });
            break;
    }
}
