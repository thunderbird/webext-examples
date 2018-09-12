if ("browserAction" in browser) {
	browser.browserAction.onClicked.addListener(async () => {
		browser.tabs.create({
			url: browser.extension.getURL("page.html"),
		});
	});	
} else {
	browser.tabs.create({
		url: browser.extension.getURL("page.html"),
	});
}
