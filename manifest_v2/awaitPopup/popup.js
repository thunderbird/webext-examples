 window.addEventListener("load", onLoad);
 
 async function notifyMode(event) {
    await messenger.runtime.sendMessage({ 
        popupResponse: event.target.getAttribute("data")
    });
    window.close();
}

async function onLoad() {
	document.getElementById("button_ok").addEventListener("click", notifyMode);
	document.getElementById("button_cancel").addEventListener("click", notifyMode);
}
