window.addEventListener("load", onLoad);

async function notifyMode(event) {
    await messenger.runtime.sendMessage({ 
        popupResponse: event.target.getAttribute("data")
    });
    window.close();
}

async function keepBackgroundAlive() {
    await messenger.runtime.sendMessage({
        ping: true
    });
    // Send a new ping in 10s.
    window.setTimeout(keepBackgroundAlive, 10000);
}

async function onLoad() {
    document.getElementById("button_ok").addEventListener("click", notifyMode);
    document.getElementById("button_cancel").addEventListener("click", notifyMode);
    keepBackgroundAlive();
}
