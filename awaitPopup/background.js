// Function to open a popup and await user feedback
async function blockingPopup() {
	async function popupClosePromise(popupId, defaultPopupCloseMode) {
		try {
			await messenger.windows.get(popupId);
		} catch (e) {
			//window does not exist, assume closed
			return defaultPopupCloseMode;
		}
		return new Promise(resolve => {
			let popupCloseMode = defaultPopupCloseMode;
			function removeListener(closedId) {
				if (popupId == closedId) {
					messenger.windows.onRemoved.removeListener(removeListener);
					messenger.runtime.onMessage.removeListener(messageListener);
					resolve(popupCloseMode);
				}
			}
			function messageListener(request, sender, sendResponse) {
				if (sender.tab.windowId == popupId && request?.popupCloseMode) {
					popupCloseMode = request.popupCloseMode;
				}
			}
			messenger.runtime.onMessage.addListener(messageListener);
			messenger.windows.onRemoved.addListener(removeListener);
		});
	}

	let window = await messenger.windows.create({
		 url: "popup.html",
		 type: "popup",
		 height: 280,
		 width: 390 });
	// await the created popup to be closed and define a default
	// return value if the window is closed without clicking a button
	let rv = await popupClosePromise(window.id, "cancel");
	console.log(rv);
 }

//listener to trigger the popup
messenger.browserAction.onClicked.addListener(blockingPopup);
