window.addEventListener("load", onLoad);

async function notifyMode(event) {
	await messenger.runtime.sendMessage({
		isPopupResponse: true,
		rv: event.target.getAttribute("data")
	});
}

async function onLoad() {
	document.getElementById("button_ok").addEventListener("click", notifyMode);
	document.getElementById("button_cancel").addEventListener("click", notifyMode);
}
