// A wrapper function returning an async iterator for a MessageList. Derived from
// https://webextension-api.thunderbird.net/en/91/how-to/messageLists.html
export async function* iterateMessagePages(page) {
    for (let message of page.messages) {
        yield message;
    }

    while (page.id) {
        page = await messenger.messages.continueList(page.id);
        for (let message of page.messages) {
            yield message;
        }
    }
}
