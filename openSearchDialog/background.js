function klickaktion() {
  browser.myapi.openSearchDialog();
}
browser.browserAction.onClicked.addListener(klickaktion);
