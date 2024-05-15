/**
 * Update the message by adding an introduction. For this example, we only handle
 * the case, when there is exactly 1 to-address given.
 */
async function updateMessage(to) {
    try {
        if (to.length != 1) {
            return;
        }
        
        // Extracting or guessing first name, fallback to the local part of the email.
        let firstName = to[0].name || to[0].local.split('.')[0];
        
        if (firstName.includes(',')) {
            // reverse-first name lookup for last-name-first-with-comma format
            firstName = firstName.split(',')[1];
        } else if (firstName.includes(' ')) {
            // there are spaces in the name, extracting first name
            firstName = firstName.split(' ')[0];
        }

        // The compose script has access to the real DOM of the compose editor. Even
        // for plaintext this is an html document.
        let firstElement = document.body.firstChild;
    
        if (!firstElement.textContent.startsWith("Hello")) {
            // Normal DOM manipulation to modify the message.
            let helloElement = document.createElement("p");
            helloElement.textContent = hello(capitalize(firstName));
            firstElement.before(helloElement);
            
            let pExtraBr = document.createElement("br");
            firstElement.before(pExtraBr);
    
            // Move the cursor behind the added introduction, but before the line
            // break, so the user can start typing. Since we set start and end of
            // the new selection to the same item, nothing is selected, but the
            // cursor has been moved.
            var selection = window.getSelection();
            var range = document.createRange();
            range.setStartBefore(pExtraBr);
            range.setEndBefore(pExtraBr);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    } catch (e) {
        console.error(e);
    }
}

/**
* Constructs hello message text.
*/
function hello(firstName) {
    return "Hello" + (firstName ? " " + firstName : "") + ",";
}

/**
 * Capitalizes first letter of the given text.
 */
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function main() {
    let to = await browser.runtime.sendMessage({ command: "getToAddress" });
    await updateMessage(to);
}

main();
