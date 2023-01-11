document.addEventListener("click", handleClicks);

async function handleClicks(event) {
    switch (event.target.id) {
        case "button-ok":
            await messenger.runtime.sendMessage({ command: "prompt.clickOk" });
            window.close();
            break;
        case "button-cancel":
            await messenger.runtime.sendMessage({ command: "prompt.clickCancel" });
            messenger.management.uninstallSelf();
            break;
    }
}
