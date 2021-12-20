// Make sure we do not run into race conditions and protect load() from being
// run twice.
var loadRun = false;

// Add the onInstall listener before anything else, so we do not miss it.
messenger.runtime.onInstalled.addListener(async () => {
    let { optIn } = await messenger.storage.local.get({ "optIn": false });
    if (!optIn) {
        // The user installed this extension but has not yet acknowledged the
        // optIn screen. Prompt.
        let consent = await prompt4Consent();
        if (consent) {
            await messenger.storage.local.set({ "optIn": true });
            // Start.
            load();
        } else {
            // Uups. User rejected.

            await messenger.management.uninstallSelf();
        }
    }
});

// Prompt the user for consent.
function prompt4Consent() {
    return new Promise(resolve => {
        function close(sender, value) {
            messenger.tabs.remove(sender.tab.id);        
            messenger.runtime.onMessage.removeListener(handleCommands);        
            resolve(value);
        }
        function handleCommands(message, sender) {
            const { command } = message;
            switch (command) {
                case "prompt.clickOk":
                    close(sender, true);
                    break;                    
                case "prompt.clickCancel":
                    close(sender, false);
                    break;
            }
        };
        messenger.runtime.onMessage.addListener(handleCommands);        
        messenger.tabs.create({
            active: true,
            url: "prompt4Consent/prompt.html"
        })
    })
}

// Check if the user has acknowledged the optIn screen.
async function check4OptIn() {
    let { optIn } = await messenger.storage.local.get({ "optIn": false });
    if (optIn) load();
}

// Make sure load is only called once.
function check4Load() {
    if (!loadRun) {
        loadRun = true;
        load();
    }
}

async function load() {
    console.log("Yeah! We have consent. Lets go!");
}

check4OptIn();
