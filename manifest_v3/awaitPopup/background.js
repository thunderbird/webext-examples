// Thunderbird can terminate idle backgrounds in Manifest V3.
// Any listener directly added during add-on startup will be registered as a
// persistent listener and the background will wake up (restart) each time the
// event is fired. 

/**
 * The Manifest V2 version of this extension is adding a temporary `runtime.onMessage`
 * event listener for the opened prompt popup. Such listeners are not registered
 * as persistent listeners and will not wake up the background, if the the popup
 * stays open longer then the background idle timeout without the user interacting
 * with it.
 * 
 * To make the example work in Manifest V3, the popup sends a periodic ping to a
 * `runtime.onMessage` listener in the background, to keep the background busy.
 * 
 * Alternatively, a global persistent `runtime.onMessage` event listener could have
 * been used. The `optIn` example extension has been updated by using such a global
 * persistent event listener.
 */

// Function to open a popup and await user feedback
async function awaitPopup() {
    async function popupPrompt(popupId, defaultResponse) {
        try {
            await messenger.windows.get(popupId);
        } catch (e) {
            // Window does not exist, assume closed.
            return defaultResponse;
        }
        return new Promise(resolve => {
            let response = defaultResponse;
            function windowRemoveListener(closedId) {
                if (popupId == closedId) {
                    messenger.windows.onRemoved.removeListener(windowRemoveListener);
                    messenger.runtime.onMessage.removeListener(messageListener);
                    resolve(response);
                }
            }
            function messageListener(request, sender, sendResponse) {
                if (sender.tab.windowId != popupId || !request) {
                    return;
                }
                
                if (request.popupResponse) {
                    response = request.popupResponse;
                }
                if (request.ping) {
                    console.log("Background ping")
                }
            }
            messenger.runtime.onMessage.addListener(messageListener);
            messenger.windows.onRemoved.addListener(windowRemoveListener);
        });
    }

    let window = await messenger.windows.create({
        url: "popup.html",
        type: "popup",
        height: 280,
        width: 390,
        allowScriptsToClose: true,
    });
    // Wait for the popup to be closed and define a default return value if the
    // window is closed without clicking a button.
    let rv = await popupPrompt(window.id, "cancel");
    console.log(rv);
}

// Listener to trigger the popup.
messenger.action.onClicked.addListener(awaitPopup);
