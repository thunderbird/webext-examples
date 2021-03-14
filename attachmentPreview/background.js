messenger.messageDisplayAction.onClicked.addListener(async(tab, info) => {
	let messages = await browser.messageDisplay.getDisplayedMessages(tab.id);
	if (messages.length != 1)
		return;
	
	messenger.windows.create({
		"type": "popup",
		"url": `popup.html?tabId=${tab.id}`
	});

});
