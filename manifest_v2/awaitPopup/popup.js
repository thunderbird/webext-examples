 window.addEventListener("load", onLoad);
 
 async function notifyMode(event) {
	await messenger.runtime.sendMessage({ popupCloseMode: event.target.getAttribute("data") });
	 //does not work until bug 1675940 has landed on ESR
	 //window.close();
	 let win = await messenger.windows.getCurrent();
	 messenger.windows.remove(win.id);
 }

 async function onLoad() {
	document.getElementById("button_ok").addEventListener("click", notifyMode);
	document.getElementById("button_cancel").addEventListener("click", notifyMode);
}