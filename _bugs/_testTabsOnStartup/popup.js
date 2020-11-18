async function close () {
	let win = await messenger.windows.getCurrent();
	// send data back to background via
	// * runtime.messaging (onMessage will learn about the closed window)
	// * windows.onRemoved event with data stored in storage
	await messenger.windows.remove(win.id);
}

async function init() {
	window.document.getElementById('closeButton').addEventListener('click', close);
	browser.browserAction.setIcon({path: "tick16.png"});
}

init();
