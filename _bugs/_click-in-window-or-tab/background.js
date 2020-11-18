messenger.browserAction.onClicked.addListener((info) => {
	 messenger.windows.create({
		 url: "help.html", 
		 type: "popup", 
		 height: 780, 
		 width: 990 });

	messenger.tabs.create({
			   url: "help.html",
		  });
  });