// Thunderbird can terminate idle backgrounds in manifest v3.
// Any listener directly added during add-on startup will be registered as a
// persistent listener and the background will wake up (restart) each time the
// event is fired. 

// Note: Promises which need a longer time to fulfill will not keep the background
//       from being terminated. The approach used by the MV2 version of this example
//       therefore no longer works. It had to be rewritten to be purely event-based.

messenger.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { command } = message;
    switch (command) {
        case "prompt.clickOk":
            // Fulfill the sendMessage Promise in popup.js
            sendResponse();
            // User agreed, execute the actual load.
            load();
            break;
        case "prompt.clickCancel":
            // Fulfill the sendMessage Promise in popup.js
            sendResponse();
            // User rejected, do nothing (popup.js uninstalls this extension)
            break;
    }
});

// Check if the user has acknowledged the optIn screen already and show it if not.
async function check4OptIn() {
    let { optIn } = await messenger.storage.local.get({ "optIn": false });
    if (!optIn) {
        // The user installed this extension but has not yet acknowledged the
        // optIn screen. Prompt.
        messenger.tabs.create({
            active: true,
            url: "prompt4Consent/prompt.html"
        })
    } else {
        // Start.
        load();
    }
}

async function load() {
    console.log("Yeah! We have consent. Lets go!");
}

check4OptIn();
