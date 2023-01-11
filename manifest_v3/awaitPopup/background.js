// Thunderbird can terminate idle backgrounds in manifest v3.
// Any listener directly added during add-on startup will be registered as a
// persistent listener and the background will wake up (restart) each time the
// event is fired. 

// Note: Promises which need a longer time to fulfill will not keep the background
//       from being terminated. The approach used by the MV2 version of this example
//       therefore no longer works. It had to be rewritten to be purely event-based.

// Listener to trigger the popup.
messenger.action.onClicked.addListener(async () => {
	let window = await messenger.windows.create({
		url: "popup.html",
		type: "popup",
		height: 280,
		width: 390
	});

	// Store the window as being pending.
	let { pendingPopups } = await browser.storage.local.get({ pendingPopups: new Set() });
	console.log({ pendingPopups });
	pendingPopups.add(window.id);
	await browser.storage.local.set({ pendingPopups });
	// handlePopupResponse() will be called when the user performs an action in
	// the popup.
});

async function handlePopupResponse(request, sender, sendResponse) {
	let windowId = sender.tab.windowId;
	let { pendingPopups } = await browser.storage.local.get({ pendingPopups: new Set() });
	console.log({ pendingPopups });

	if (pendingPopups.has(windowId) && request && request.rv) {
		pendingPopups.delete(windowId);
		await browser.storage.local.set({ pendingPopups });
		console.log(request.rv);
		sendResponse();
		window.setTimeout(messenger.windows.remove(windowId))
	}
}

// The background can either react on messages being send from the popup and then
// close the popup, or the popup can store the desired return value in the storage,
// close the popup and the background only reacts on windows.onClosed events.
// This example uses the message approach.

// Listener to react on user actions in the popup.
messenger.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// Do NOT use the return value of handlePopupResponse() as the return value
	// of the onMessage listener. Since it is a Promise, it will answer all
	// sendMessage requests, which might not the desired behavior. See
	// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#addlistener_syntax
	if (request.isPopupResponse) {
		handlePopupResponse(request, sender, sendResponse);
	}
});
